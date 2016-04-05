SublimeGame.LevelOne = function(game) {
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

SublimeGame.LevelOne.prototype = {
  create: function() {
    this.world.setBounds(0, 0, 2000, 640);
    this.physics.startSystem(Phaser.Physics.ARCADE);


    /* Create platforms */
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
    this.ground.scale.setTo(1.8, 2);
    this.ground.body.immovable = true;

    this.ground2 = this.platforms.create(900, this.game.world.height - 64, 'ground');
    this.ground2.scale.setTo(1, 2);
    this.ground2.body.immovable = true;

    this.ground3 = this.platforms.create(1080, this.game.world.height - 64, 'ground');
    this.ground3.scale.setTo(2.5, 2);
    this.ground3.body.immovable = true;

    /* Create player */
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    this.game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2; //FIX: reduce bounce
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    /* Load box obstacles */
    this.boxes = this.add.group();
    this.boxes.enableBody = true;
    this.box1 = this.boxes.create(300, this.game.world.height - 96, 'box');
    this.box1.scale.setTo(0.3,0.3);
    this.box1.body.immovable = true;
    this.box2 = this.boxes.create(450, this.game.world.height - 96, 'box');
    this.box2.scale.setTo(0.3,0.3);
    this.box2.body.immovable = true;
    this.box3 = this.boxes.create(487, this.game.world.height - 96, 'box');
    this.box3.scale.setTo(0.3,0.3);
    this.box3.body.immovable = true;
    this.box4 = this.boxes.create(487, this.game.world.height - 133, 'box');
    this.box4.scale.setTo(0.3,0.3);
    this.box4.body.immovable = true;

    /* Load finish line */
    this.diamond = this.game.add.sprite(this.game.world.width-100, this.game.world.height-150, 'diamond');
    this.game.physics.arcade.enable(this.diamond);
    this.diamond.body.gravity.y = 300;
    this.diamond.body.collideWorldBounds = true;

    /* Create instructions menu */
    this.addText();

    /* Add camera follow */
    this.game.camera.follow(this.player);

    /* Implement keyboard controls */
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spacebar = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  },

  update: function() {
    /* Land player, diamond, and box on platforms */
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.diamond, this.platforms);
    this.game.physics.arcade.collide(this.box, this.platforms);

    /* Player cannot walk through box obstacles */
    this.game.physics.arcade.collide(this.player, this.boxes);

    /* Game ends when player reaches diamond */
    this.game.physics.arcade.overlap(this.player, this.diamond, this.quitGame, null, this);


    /* on each update, resets player velocity to 0 */
    this.player.body.velocity.x = 0;

    /* Setup multi key movement */
    if (this.keys[18] && this.keys[37]) { // OPT: 18; Arrow Left: 37
      /* Big move left */
      this.prevX = this.player.body.position.x;
      this.player.body.position.x = this.prevX - 20;
    } else if (this.keys[18] && this.keys[39]) { // OPT: 18; Arrow Right: 39
      /* Big move right */
      this.prevX = this.player.body.position.x;
      this.player.body.position.x = this.prevX + 20;
    }
    /* Setup single key movement */
    else if (this.cursors.left.isDown) {
      /* Moves left */
      this.player.body.velocity.x = -150;
      this.player.animations.play('left');
    } else if (this.cursors.right.isDown) {
      /* Moves right */
      this.player.body.velocity.x = 150;
      this.player.animations.play('right');
    }  else if (this.cursors.up.isDown && this.player.body.touching.down) {
      /* Jump */
      this.player.body.velocity.y = -150;
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
    this.levelInstructions = this.game.add.text(620, this.game.world.centerY - 50, 'Level 1:\nArrows\nOPT + Arrows');
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
    this.state.start('LevelTwo'); // congratulations screen
  }

};
