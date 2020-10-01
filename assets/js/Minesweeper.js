class Minesweeper {
    constructor({el, width, height, level}) {
        this.canvas = el;
        this.ctx = el.getContext('2d');
        this.canvas.width = width;
        this.blocks = [];
        this.canvas.height = height;
        this.level = level;
        this.firstClick = false;
        this.difficultlies = {
           easy: {
               mines_count: 10,
               block_count_x: 10,
               block_count_y: 10,
               no_mines_radius: 4
           },
           medium: {
               mines_count: 40,
               block_count_x: 18,
               block_count_y: 15,
               no_mines_radius: 5
           },
           hard: {
               mines_count: 99,
               block_count_x: 24,
               block_count_y: 20,
               no_mines_radius: 5
           },

        };
        
        this.blockSettings = {
            width: width / this.difficultlies[level].block_count_x ,
            height: height / this.difficultlies[level].block_count_y ,
            color1: "#00b894",
            color2: "#06d1a9",
            hoverColor: "rgba(85, 239, 196,0.5)"
        }
        this.initBoard();
        this.mouseEvent()
    }
    render() {
        this.draw();
        requestAnimationFrame(() => {
            this.render();
        });
    }

    initBoard() {
        let settings = this.difficultlies[this.level];

        for(var i = 0; i < settings.block_count_y; i++) {
            this.blocks.push([])
            for(var j = 0; j < settings.block_count_x; j++) {
                let x = this.blockSettings.width * j;
                let y = this.blockSettings.height * i;
                let color;
                if(i % 2 == 1) {
                    if(j % 2 == 0) {
                        color = this.blockSettings.color1
                    }else{
                        color = this.blockSettings.color2
                    }
                }else if(i % 2 == 0) {
                    if(j % 2 == 0) {
                        color = this.blockSettings.color2
                    }else{
                        color = this.blockSettings.color1
                    }
                }
                this.blocks[i].push({
                    color, x, y, status: false, hover:false, content: ''
                })
            }
        }
        console.log(this.blocks)
    }
    draw() {
        // console.log(this.blocks)
        this.blocks.forEach(row => {
            row.forEach(col => {
                // console.log("asd")
                this.ctx.fillStyle = col.hover ? this.blockSettings.hoverColor : col.color;
                this.ctx.fillRect(col.x, col.y, this.blockSettings.width, this.blockSettings.height)
            });
        });
    }
    generateMines() {

    }
    go() {
        
    }
    mouseEvent() {
        let that = this;
        this.canvas.addEventListener('mousemove', function(e) {
            let rect = that.canvas.getBoundingClientRect()
            let mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }

            that.blocks.forEach((row,indexRow) => {
                row.forEach((col,indexCol) => {
                    if(col.status == false && 
                        mousePosition.x >= col.x &&
                        mousePosition.x <= col.x + that.blockSettings.width &&
                        mousePosition.y >= col.y &&
                        mousePosition.y <= col.y + that.blockSettings.height) {
                        that.blocks[indexRow][indexCol].hover = true;
                    }else{
                        that.blocks[indexRow][indexCol].hover = false;
                    }
                })
            })      
        })
        this.canvas.addEventListener('click', function(e) {
            let rect = that.canvas.getBoundingClientRect()
            let mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }

            that.blocks.forEach((row,indexRow) => {
                row.forEach((col,indexCol) => {
                    if(col.status == false && 
                        mousePosition.x >= col.x &&
                        mousePosition.x <= col.x + that.blockSettings.width &&
                        mousePosition.y >= col.y &&
                        mousePosition.y <= col.y + that.blockSettings.height) {
                        if(!this.firstClick) {
                            this.generateMines()
                            this.go()
                        }
                        console.log('clicked at ',col)
                    }
                })
            }) 
        })
    }
    mineClicked() {

    }
}