window.SublimeGame = {};

SublimeGame.Boot = function(game) {
  // TODO: nothing here?
};

SublimeGame.Boot.prototype = {
  init: function() {

    /* Reset default to not use multi-touch */
    this.input.maxPointers = 1;
    // TODO: negate phaser default to pause on losing focus?
      // this.stage.disableVisibilityChange = true;
  },

  preload: function() {
    this.load.image('preloaderBackground', 'assets/sky.png');
  },

  create: function() {
    this.state.start('Preloader');
  }
}
