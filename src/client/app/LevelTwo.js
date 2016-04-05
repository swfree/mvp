SublimeGame.LevelTwo = function(game) {
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

SublimeGame.LevelTwo.prototype = {
  create: function() {
    this.world.setBounds(0, 0, 1240, 600);
    this.physics.startSystem(Phaser.Physics.ARCADE);

    /* Create platforms */
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
    this.ground.scale.setTo(0.7, 2);
    this.ground.body.immovable = true;

    this.floatingLedge = this.platforms.create(280, 350, 'float');
    this.floatingLedge.scale.setTo(0.5, 0.5);
    this.floatingLedge.body.immovable = true;

    this.fixedLedge = this.platforms.create(480, this.game.world.height - 40, 'ground');
    this.fixedLedge.scale.setTo(0.8, 1);
    this.fixedLedge.body.immovable = true;

    this.sidewaysLedge = this.platforms.create(800, this.game.world.height - 40, 'sideways');
    this.sidewaysLedge.scale.setTo(0.5, 0.5);
    this.sidewaysLedge.body.immovable = true;

    this.fixedLedge = this.platforms.create(this.game.world.width - 100, this.game.world.height - 40, 'ground');
    this.fixedLedge.body.immovable = true;

    /* Create player */
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    this.game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2; //FIX: reduce bounce
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    /* Load finish line */
    this.diamond = this.game.add.sprite(this.game.world.width-100, this.game.world.height-175, 'diamond');
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

    /* Sidways platform movement */
    if (this.keys[219] && this.keys[91]) { // CMD + [
      // move sidewaysLedge platform left 
      this.prevX = this.sidewaysLedge.body.position.x;
      this.sidewaysLedge.body.position.x = this.prevX - 20;
      this.keys[219] = false; 
      // this.keys[91] = false;
    } else if (this.keys[221] && this.keys[91]) { // CMD + ]
      // move sidewaysLedge platform right
      this.prevX = this.sidewaysLedge.body.position.x;
      this.sidewaysLedge.body.position.x = this.prevX + 20;
      this.keys[221] = false;
      // this.keys[91] = false;
    }

    /* Up/downplatform movement */
    else if (this.keys[91] && this.keys[17] && this.keys[38]) { //CMD + CTL + up arrows
      /* Move platform up */
      this.prevY = this.floatingLedge.body.position.y;
      this.floatingLedge.body.position.y = this.prevY - 20;
      // this.keys[91] = false;
      // this.keys[17] = false;
      this.keys[38] = false;
    } else if (this.keys[91] && this.keys[17] && this.keys[40]) {//CMD + CTL +/down arrows
      /* Move platform down */
      this.prevY = this.floatingLedge.body.position.y;
      this.floatingLedge.body.position.y = this.prevY + 20;
      // this.keys[91] = false;
      // this.keys[17] = false;
      this.keys[40] = false;
    }

    // /* Setup multi key player movement */
    // else if (this.keys[18] && this.keys[37]) { // OPT: 18; Arrow Left: 37
    //   /* Big move left */
    //   this.prevX = this.player.body.position.x;
    //   this.player.body.position.x = this.prevX - 20;
    // } else if (this.keys[18] && this.keys[39]) { // OPT: 18; Arrow Right: 39
    //   /* Big move right */
    //   this.prevX = this.player.body.position.x;
    //   this.player.body.position.x = this.prevX + 20;
    // }

    /* Setup single key player movement */
    else if (this.cursors.left.isDown) {
      /* Moves left */
      this.player.body.velocity.x = -150;
      this.player.animations.play('left');
    } else if (this.cursors.right.isDown) {
      /* Moves right */
      this.player.body.velocity.x = 150;
      this.player.animations.play('right');
    }  
    // FIX BUG: disabled jump because I cannot prevent the jump when the floatingPlatform moves up
    // else if (!this.keys[91] && !this.keys[17] && this.cursors.up.isDown && this.player.body.touching.down) {
    //   /* Jump */
    //   this.player.body.velocity.y = -150;
    // } 
    else { /* Stands still */
      this.player.animations.stop();
      this.player.frame = 4;
    }

    /* Toggle instructions menu */
    if (this.keys[91] && this.keys[75]) { // if CMD K > CMD B are pressed
      // this.keys[91] = false;
      // this.keys[75] = false;
      if (this.keys[66]) {
        // this.keys[91] = false;
        this.keys[66] = false;
        this.keys[75] = false;
        this.toggleInstructions(); // debounce
        console.log('toggle instructions');
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
    if (this.levelInstructions.visible) {
      this.levelInstructions.visible = false;
    } else {
      this.levelInstructions.visible = true;
    }
  },

  addText: function() {
    this.levelInstructions = this.game.add.text(620, this.game.world.centerY - 50, 'Level 2:\nPlatform Up/Down- CMD+CTL+Arrows\nPlatform Sideways- CMD+[ ]');
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

  quitGame: function(pointer) {
    // TODO:some cool animation to blow up the diamond you bumped into
    this.state.start('LevelThree'); // congratulations screen
  }

};
