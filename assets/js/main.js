const canvas = document.getElementById('canvas');
const game = new Minesweeper({
    el:canvas,
    height: 720,
    width: 720,
    level: 'easy'
})
game.render()