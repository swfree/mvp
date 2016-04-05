SublimeGame.Preloader = function(game) {
  this.background = null;

  this.ready = false;
};

SublimeGame.Preloader.prototype = {
  preload: function() {
    //TODO: make proper loading-game background
    this.background = this.add.sprite(0, 0, 'preloaderBackground');

    /* Load all game assets */
    this.load.image('titlepage', 'assets/phaser.png');
    this.load.image('playButton', 'assets/diamond.png');
    // this.load.audio

    this.load.image('ground', 'assets/platform.png');
    // TODO: set dudes starting size/position myself:
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.load.image('box', 'assets/firstaid.png');
  },

  create: function() {
    this.ready = true;
    this.state.start('MainMenu');
  }
}
