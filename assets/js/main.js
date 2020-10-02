let btnPlay = document.getElementById('btn-play');
let difficultly = document.getElementById('difficultly')
const canvas = document.getElementById('canvas');

btnPlay.addEventListener('click', function(e) {
    let level = difficultly.value
    
    const game = new Minesweeper({
        el:canvas,
        height: 720,
        width: 720,
        level,
        bombImageEl: document.getElementById('bomb')
    })
    game.render()

    btnPlay.style.display = 'none'
    document.getElementById('starter').style.display = 'none'
    document.getElementById('numOfMines').innerText = game.difficultlies[level].mines_count
});