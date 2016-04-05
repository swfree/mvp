SublimeGame.MainMenu = function(game) {
  // this.music = null; // remove
  this.playButton = null; // remove??
};

SublimeGame.MainMenu.prototype = {
  create: function() {
    // TODO:
    this.title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, 'SHORTCUT STRUT');
     // Center align
    this.title.anchor.set(0.5);
    this.title.align = 'center';

    //  Font style
    this.title.font = 'Arial Black';
    this.title.fontSize = 50;
    this.title.fontWeight = 'bold';

    //  Stroke color and thickness
    this.title.stroke = '#000000';
    this.title.strokeThickness = 6;
    this.title.fill = '#43d637';

    this.playButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 50, 'playButton', this.startGame, this, 2, 1, 0);
  },

  update: function() {
    // unecessary ?
  },
  startGame: function(pointer) {
    this.state.start('LevelOne');
  }
}
