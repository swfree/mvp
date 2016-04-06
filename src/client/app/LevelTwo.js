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
    this.world.setBounds(0, 0, 1240, 640);
    this.physics.startSystem(Phaser.Physics.ARCADE);

    /* Create platforms */
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0, this.game.world.height - 90, 'ground');
    this.ground.scale.setTo(0.7, 3);
    this.ground.body.immovable = true;

    this.floatingLedge = this.platforms.create(280, 350, 'float');
    this.floatingLedge.scale.setTo(0.5, 0.5);
    this.floatingLedge.body.immovable = true;

    this.fixedLedge = this.platforms.create(480, this.game.world.height - 200, 'ground');
    this.fixedLedge.scale.setTo(0.8, 2);
    this.fixedLedge.body.immovable = true;

    this.sidewaysLedge = this.platforms.create(800, this.game.world.height - 200, 'sideways');
    this.sidewaysLedge.scale.setTo(0.5, 0.5);
    this.sidewaysLedge.body.immovable = true;

    this.fixedLedge = this.platforms.create(this.game.world.width - 100, this.game.world.height - 200, 'ground');
    this.fixedLedge.scale.setTo(0.5, 2);
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
    this.diamond = this.game.add.sprite(this.game.world.width-100, this.game.world.height-250, 'diamond');
    this.game.physics.arcade.enable(this.diamond);
    this.diamond.body.gravity.y = 300;
    this.diamond.body.collideWorldBounds = true;

    /* Create instructions menu */
    this.addText();
    this.addRestart();
    this.addTimer();


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
      /* check if player is on platform */
      var playerX = this.player.body.position.x;
      this.prevX = this.sidewaysLedge.body.position.x;
      
      if (playerX > this.prevX && playerX < this.prevX+200) {
        this.player.body.position.x = playerX - 20;
      }

      // move sidewaysLedge platform left 
      this.sidewaysLedge.body.position.x = this.prevX - 20;
      this.keys[219] = false; 
      // this.keys[91] = false;
    } else if (this.keys[221] && this.keys[91]) { // CMD + ]
      /* check if player is on platform */
      var playerX = this.player.body.position.x;
      this.prevX = this.sidewaysLedge.body.position.x;

      if (playerX > this.prevX && playerX < this.prevX+200) {
        this.player.body.position.x = playerX + 20;
      }

      // move sidewaysLedge platform right
      this.sidewaysLedge.body.position.x = this.prevX + 20;
      this.keys[221] = false;
      // this.keys[91] = false;
    }

    /* Up/downplatform movement */
    else if (this.keys[91] && this.keys[17] && this.keys[38]) { //CMD + CTL + up arrows
      /* check if player is on platform */
      var playerX = this.player.body.position.x;
      var playerY = this.player.body.position.y;
      if (playerX > 280 && playerX < 480) {
        this.player.body.gravity.y = 0;
        this.player.body.position.y = playerY - 20;
      }
      /* Move platform up */
      this.prevY = this.floatingLedge.body.position.y;
      this.floatingLedge.body.position.y = this.prevY - 20;
      this.player.body.gravity.y = 300;
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

    /* Setup single key player movement */
    else if (this.cursors.left.isDown) {
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

  addRestart: function() {
    this.restart = this.game.add.text(this.game.world.width-230, 40, "RESTART LEVEL", { 
      font: "15px Arial Black", 
      fontWeight: "bold", 
      fill: "#d6dbde"
    });

    this.restart.inputEnabled = true;
    this.restart.events.onInputDown.add(this.restartLevel, this);
  },

  restartLevel: function() {
    clearInterval(this.interval);
    this.state.start('LevelTwo');
  },

  addText: function() {
    // this.levelInstructions = this.game.add.text(620, this.game.world.centerY - 100, 'Level 2 - Line Movements:\n\nCMD + CTRL + Arrows: move line up & down\nCMD + [ or ]: indent line left or right');
    this.levelInstructions = this.game.add.text(620, this.game.world.centerY - 100, 'Level 2 - Line Movements\n\nControls...               Sublime        ~        Shortcut Strut\nCMD + CTRL + Arrows... move line up/down ~ move platform up/down\nCMD + [ or ]...   indent line left or right   ~   move platform left/right\nCMD + K / B...    toggle sidebar ~ toggle instructions');
     

     // Center align
    this.levelInstructions.anchor.set(0.5);
    this.levelInstructions.align = 'center';

    //  Font style
    this.levelInstructions.font = 'Arial';
    this.levelInstructions.fontSize = 20;

    //  Stroke color and thickness
    this.levelInstructions.fill = '#e57254';
  },

  addTimer: function() {
    this.counter = 0;
    this.timer = this.game.add.text(this.game.world.width-230, 65, "Seconds Elapsed: " + this.counter, { 
      font: "15px Arial Black", 
      fontWeight: "bold", 
      fill: "#d6dbde", 
    });
    this.interval = setInterval(this.updateTimer.bind(this), 1000);
  },

  updateTimer: function() {
    this.counter++;
    this.timer.text = "Seconds Elapsed: " + this.counter;
  },

  quitGame: function(pointer) {
    // TODO:some cool animation to blow up the diamond you bumped into
    this.state.start('LevelThree'); // congratulations screen
  }

};
