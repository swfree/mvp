SublimeGame.LevelThree = function(game) {
  /* Preset */
  this.game;
  this.add;
  this.camera;
  this.cache;
  this.input;
  this.load;
  this.math;
  this.sound;
  this.stage;
  this.time;
  this.tweens;
  this.state;
  this.world;
  this.particles;
  this.physics;
  this.rnd;

  /* Custom */
  this.platforms;
  this.ground;
  this.fixedLedge;
  this.floatingLedge;
  this.player;
  this.cursors;
  this.downPlatform;
  this.upPlatform;
  this.prevX;
  this.prevY;
  this.keys = {};
  this.instructions;
};

SublimeGame.LevelThree.prototype = {
  create: function() {
    this.world.setBounds(0, 0, 800, 600);
    this.physics.startSystem(Phaser.Physics.ARCADE);

    /* Create platforms */
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
    this.ground.scale.setTo(2.5, 2);
    this.ground.body.immovable = true;

    this.wall = this.platforms.create(this.game.world.centerX + 95, 400, 'ground');
    this.wall.scale.setTo(0.1, 6);
    this.wall.body.immovable = true;

    /* Create player */
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    this.game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2; //FIX: reduce bounce
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    /* Load finish line */
    this.diamond = this.game.add.sprite(this.game.world.width-30, this.game.world.height-175, 'diamond');
    this.game.physics.arcade.enable(this.diamond);
    this.diamond.body.gravity.y = 300;
    this.diamond.body.collideWorldBounds = true;

    /* Create instructions menu */
    this.addText();

    /* Add camera follow */
    this.game.camera.follow(this.player);

    /* Implement keyboard controls */
    this.cursors = this.game.input.keyboard.createCursorKeys();
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  },

  update: function() {
    /* Land player, diamond on platforms */
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.diamond, this.platforms);

    /* Game ends when player reaches diamond */
    this.game.physics.arcade.overlap(this.player, this.diamond, this.quitGame, null, this);

    /* on each update, resets player velocity to 0 */
    this.player.body.velocity.x = 0;

    /* Setup single key player movement */
    if (this.keys[91] && this.keys[18] && this.keys[50]) { // split pane: CMD[91] OPT[18] 2[50]
      this.keys[91] = false;
      this.keys[18] = false;
      this.keys[50] = false;
      // split pane
      // TODO: start with this outline over whole game
      // when these keys are pressed, split outline into 2... with different outlines highlighted
      this.outline1 = this.game.add.sprite(100, 350, 'ground');
      this.outline1.scale.setTo(2, 5);
      this.outline1.alpha = 0.3;
    } else if (this.keys[17] && this.keys[16] && this.keys[50]) { // move pane focus CTR[17] SH[16] 2[50]
      // move player to other pane
      this.prevX = this.player.body.position.x;
      this.player.body.position.x = this.prevX + 60;
    } else if (this.cursors.left.isDown) {
      /* Moves left */
      this.player.body.velocity.x = -150;
      this.player.animations.play('left');
    } else if (this.cursors.right.isDown) {
      /* Moves right */
      this.player.body.velocity.x = 150;
      this.player.animations.play('right');
    } else { /* Stands still */
      this.player.animations.stop();
      this.player.frame = 4;
    }

    /* Toggle instructions menu */
    if (this.keys[91] && this.keys[75]) { // if CMD K > CMD B are pressed
      this.keys[91] = false;
      this.keys[75] = false;
      if (this.keys[66]) {
        this.keys[91] = false;
        this.keys[66] = false;
        this.toggleInstructions(); // debounce
      }
    }

  },

  onKeyDown: function(e) {
    e.preventDefault();
    this.keys[e.which] = true;
  },

  onKeyUp: function(e) {
    e.preventDefault();
    this.keys[e.which] = false;
  },

  toggleInstructions: function() {
    if (this.levelInstructions) {
      this.removeText();
    } else {
      this.addText();
    }
  },

  addText: function() {
    this.levelInstructions = this.game.add.text(620, this.game.world.centerY - 50, 'Level 3:\nSplit Panes CMD+OPT+2\nChange pane focus CTL+SH+2');
     // Center align
    this.levelInstructions.anchor.set(0.5);
    this.levelInstructions.align = 'center';

    //  Font style
    this.levelInstructions.font = 'Arial Black';
    this.levelInstructions.fontSize = 20;
    this.levelInstructions.fontWeight = 'bold';

    //  Stroke color and thickness
    this.levelInstructions.stroke = '#000000';
    this.levelInstructions.strokeThickness = 6;
    this.levelInstructions.fill = '#43d637';
  },

  removeText: function() {
    this.levelInstructions.destroy();
  },

  quitGame: function(pointer) {
    // TODO:some cool animation to blow up the diamond you bumped into
    this.state.start('LevelFour'); // congratulations screen
  }

};
