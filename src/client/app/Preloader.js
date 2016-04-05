SublimeGame.Preloader = function(game) {
  this.background = null;

  this.ready = false;
};

SublimeGame.Preloader.prototype = {
  preload: function() {
    /* Load all game assets */
    this.load.image('titlepage', 'assets/phaser.png');
    this.load.image('playButton', 'assets/arrow.png');
    this.load.image('diamond', 'assets/diamond.png');

    this.load.image('ground', 'assets/platform.png');
    // TODO: set dudes starting size/position myself:
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.load.spritesheet('coin', 'assets/coin.png', 32, 32);
    this.load.image('box', 'assets/block2.png');
  },

  create: function() {
    this.ready = true;
    this.state.start('MainMenu');
  }
}
