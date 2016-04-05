SublimeGame.MainMenu = function(game) {
  // this.music = null; // remove
  this.playButton = null; // remove??
};

SublimeGame.MainMenu.prototype = {
  create: function() {
    // TODO:
    this.add.sprite(0, 0, 'titlepage');
    this.playButton = this.add.button(this.game.world.centerX - 95, 400, 'playButton', this.startGame, this, 2, 1, 0);
  },

  update: function() {
    // unecessary ?
  },
  startGame: function(pointer) {
    this.state.start('LevelOne');
  }
}
