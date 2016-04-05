SublimeGame.LevelFour = function(game) {
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
  this.coinsCollected = 0;
};

SublimeGame.LevelFour.prototype = {
  create: function() {
    this.world.setBounds(0, 0, 800, 600);
    this.physics.startSystem(Phaser.Physics.ARCADE);

    /* Create platforms */
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
    this.ground.scale.setTo(2.5, 2);
    this.ground.body.immovable = true;

    this.shelf = this.platforms.create(205, 350, 'ground');
    this.shelf.scale.setTo(0.7, 0.5);
    this.shelf.body.immovable = true;

    /* Create coins :TODO turn coin into a class, instantiate 4 new Coin(xPos)*/
    this.coin1 = this.game.add.sprite(220, 250, 'coin');
    this.game.physics.arcade.enable(this.coin1);
    this.coin1.body.gravity.y = 300;
    this.coin1.body.collideWorldBounds = true;
    this.coin1.animations.add('spin', [0, 1, 2, 3, 4, 5, 6], true);
    this.coin1.animations.play('spin', 10, true);

    this.coin2 = this.game.add.sprite(270, 250, 'coin');
    this.game.physics.arcade.enable(this.coin2);
    this.coin2.body.gravity.y = 300;
    this.coin2.body.collideWorldBounds = true;
    this.coin2.animations.add('spin', [0, 1, 2, 3, 4, 5, 6], true);
    this.coin2.animations.play('spin', 10, true);

    this.coin3 = this.game.add.sprite(320, 250, 'coin');
    this.game.physics.arcade.enable(this.coin3);
    this.coin3.body.gravity.y = 300;
    this.coin3.body.collideWorldBounds = true;
    this.coin3.animations.add('spin', [0, 1, 2, 3, 4, 5, 6], true);
    this.coin3.animations.play('spin', 10, true);

    this.badCoin = this.game.add.sprite(370, 250, 'coin');
    this.game.physics.arcade.enable(this.badCoin);
    this.badCoin.body.gravity.y = 300;
    this.badCoin.body.collideWorldBounds = true;
    // this.badCoin.animations.add('spin', [0, 1, 2, 3, 4, 5, 6], true);
    // this.badCoin.animations.play('spin', 10, true);

    this.coin4 = this.game.add.sprite(420, 250, 'coin');
    this.game.physics.arcade.enable(this.coin4);
    this.coin4.body.gravity.y = 300;
    this.coin4.body.collideWorldBounds = true;
    this.coin4.animations.add('spin', [0, 1, 2, 3, 4, 5, 6], true);
    this.coin4.animations.play('spin', 10, true);

    /* Create player */
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    this.game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2; //FIX: reduce bounce
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    /* Create instructions menu */
    this.addText();

    /* Add camera follow */
    this.game.camera.follow(this.player);

    /* Implement keyboard controls */
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.deleteKey = this.game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  },

  update: function() {
    /* Land player, diamond on platforms */
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.collide(this.diamond, this.platforms);
    this.game.physics.arcade.collide(this.coin1, this.platforms);
    this.game.physics.arcade.collide(this.coin2, this.platforms);
    this.game.physics.arcade.collide(this.coin3, this.platforms);
    this.game.physics.arcade.collide(this.coin4, this.platforms);
    this.game.physics.arcade.collide(this.badCoin, this.platforms);

    /* Game ends when player reaches diamond */
    this.game.physics.arcade.overlap(this.player, this.diamond, this.quitGame, null, this);

    /* on each update, resets player velocity to 0 */
    this.player.body.velocity.x = 0;

    /* Select coins */
    if (this.keys[68] && this.keys[91]) { // CMD + D
      this.checkCoinsCollected('collect');
      this.keys[68] = false;
    } else if (this.keys[75] && this.keys[91]) {
      this.checkCoinsCollected('skip');
      this.keys[75] = false;
    } else if (this.keys[8]) {
      console.log('delete hit!');
      this.checkCoinsCollected('finish');

    /* Setup single key player movement */
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

  checkCoinsCollected: function(selectionType) {
    if (selectionType === 'collect') {
      if (this.coinsCollected === 0) {
        this.coin1.alpha = 0.3;
        this.coinsCollected++;
      } else if (this.coinsCollected === 1) {
        this.coin2.alpha = 0.3;
        this.coinsCollected++;
      } else if (this.coinsCollected === 2) {
        this.coin3.alpha = 0.3;
        this.coinsCollected++;
      } else if (this.coinsCollected === 4) {
        this.coin4.alpha = 0.3;
        this.coinsCollected++;
      } else {
        // reset FUNCTION:
        this.coin1.alpha = 1;
        this.coin2.alpha = 1;
        this.coin3.alpha = 1;
        this.coin4.alpha = 1;
        this.coinsCollected = 0;
      }
      console.log('collected: ', this.coinsCollected);
    } else if (selectionType === 'skip') {
      if (this.coinsCollected === 3) {
        this.coinsCollected++;
      } else {
        // reset FUNCTION:
        this.coin1.alpha = 1;
        this.coin2.alpha = 1;
        this.coin3.alpha = 1;
        this.coin4.alpha = 1;
        this.coinsCollected = 0;
      }
      console.log('skipped', this.coinsCollected);
    } else if (selectionType === 'finish') {
      if (this.coinsCollected === 5) {
        this.showExit();
      } else {
        // reset FUNCTION:
        this.coin1.alpha = 1;
        this.coin2.alpha = 1;
        this.coin3.alpha = 1;
        this.coin4.alpha = 1;
        this.coinsCollected = 0;
      }
      console.log('ended', this.coinsCollected);
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

  showExit: function() {
    /* flag so this only happens once */
    if (!this.exitMade) {
      /* Destroy coins */
      this.coin1.destroy();
      this.coin2.destroy();
      this.coin3.destroy();
      this.coin4.destroy();
      /* Load finish line */
      this.diamond = this.game.add.sprite(this.game.world.width-30, this.game.world.height-175, 'diamond');
      this.game.physics.arcade.enable(this.diamond);
      this.diamond.body.gravity.y = 300;
      this.diamond.body.collideWorldBounds = true;
      this.exitMade = true;
    }
  },

  toggleInstructions: function() {
    if (this.levelInstructions) {
      this.removeText();
    } else {
      this.addText();
    }
  },

  addText: function() {
    this.levelInstructions = this.game.add.text(500, this.game.world.centerY - 100, 'Level 4:\nSelect CMD+D\nDelete to show exit\nDont collect the frozen coin!');
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
    this.state.start('MainMenu'); // congratulations screen
  }

};
