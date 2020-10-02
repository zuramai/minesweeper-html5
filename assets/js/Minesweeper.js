class Minesweeper {
    constructor({el, width, height, level, bombImageEl}) {
        this.canvas = el;
        this.ctx = el.getContext('2d');
        this.canvas.width = width;
        this.blocks = [];
        this.canvas.height = height;
        this.level = level;
        this.gameOver = false;
        this.firstClick = false;
        this.bombImage = bombImageEl;
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
            color1: "#aad751",
            color2: "#a2d149",
            hoverColor: "rgba(85, 239, 196,0.5)"
        }
        this.initBoard();
        this.mouseEvent()
    }
    render() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
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
                    color, x, y, status: false, hover:false, content: '', revealed: false
                })
            }
        }
        console.log(this.blocks)
    }
    draw() {
        console.log(this.gameOver)
        this.blocks.forEach((row, rowIndex) => {
            row.forEach((col,colIndex) => {
                if(col.content == "mine" && this.gameOver == true) {
                    this.ctx.fillStyle = "rgba(214, 48, 49,0.2)";
                    this.ctx.fillRect(col.x, col.y, this.blockSettings.width, this.blockSettings.height)
                    this.ctx.drawImage(this.bombImage, col.x, col.y, this.blockSettings.width, this.blockSettings.height)
                }else if(Number.isInteger(col.content) && col.revealed){
                    if((rowIndex % 2 == 0 && colIndex % 2 == 1) || (colIndex % 2 == 0 && rowIndex % 2 == 1)) this.ctx.fillStyle = "#e5c29f";
                    else this.ctx.fillStyle = "#d7b899"

                    this.ctx.fillRect(col.x, col.y, this.blockSettings.width, this.blockSettings.height)

                    if(col.content !== 0) {
                        this.ctx.fillStyle = "#fff";
                        this.ctx.font = "30px Arial"
                        this.ctx.fillText(col.content, col.x + this.blockSettings.width/2 - this.ctx.measureText(col.content).width/2, col.y + this.blockSettings.height/2 + 10)
                    }
                }else{
                    this.ctx.fillStyle = col.hover && !col.revealed ? this.blockSettings.hoverColor : col.color;
                    this.ctx.fillRect(col.x, col.y, this.blockSettings.width, this.blockSettings.height)
                }
            });
        });
        this.generateNumbers();

    }
    generateMines(clickRowIndex, clickColIndex) {
        let numberOfMines = this.difficultlies[this.level].mines_count;
        let i = 1;
        while(i <= numberOfMines) {
            let choosedBlocks = this.getRandomBlock();
            if(choosedBlocks.rowIndex == clickRowIndex && choosedBlocks.colIndex == clickColIndex) {
                continue;
            }else{
                this.blocks[choosedBlocks.rowIndex][choosedBlocks.colIndex].content = "mine";
                i++;
            }
        }
    }
    generateNumbers() {
        this.blocks.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if(col.content == 'mine')
                    return
                let minesNear = 0;

                let mapBlock = {
                    top: [-1,0],
                    bottom: [1, 0],
                    left: [0, -1],
                    right: [0, 1],
                    topRight: [-1,1],
                    topLeft: [-1, -1],
                    bottomRight: [1, 1],
                    bottomLeft: [1, -1],
                }

                for(let direction in mapBlock) {
                    let block_count_x = this.difficultlies[this.level].block_count_x - 1;
                    let block_count_y = this.difficultlies[this.level].block_count_y - 1;
                    
                    if(direction == 'top' &&  rowIndex == 0) continue;
                    else if(direction == 'left' &&  colIndex == 0) continue;
                    else if(direction == 'right' &&  colIndex == block_count_x) continue;
                    else if(direction == 'bottom' &&  rowIndex == block_count_y) continue;
                    else if(direction == 'topRight' &&  (rowIndex == 0 || colIndex == block_count_x)) continue;
                    else if(direction == 'topLeft' &&  (rowIndex == 0 || colIndex == 0)) continue;
                    else if(direction == 'bottomRight' &&  (rowIndex == block_count_y || colIndex == block_count_x)) continue;
                    else if(direction == 'bottomLeft' &&  (rowIndex == block_count_y || colIndex == 0)) continue;

                    let nextBlock = this.blocks[rowIndex + mapBlock[direction][0]][colIndex + mapBlock[direction][1]];

                    if(nextBlock.content == 'mine') minesNear++
                }
                col.content = minesNear
            })
        })
    }
    getRandomBlock() {
        let rowIndex = Math.floor(Math.random() * this.blocks.length);
        let colIndex = Math.floor(Math.random() * this.blocks[rowIndex].length);
        return {
            rowIndex, colIndex
        }
    }
    go(rowIndex, colIndex, rangeNo, isFirstClick=false) {
        
        let mapBlock = {
            top: [-1,0],
            bottom: [1, 0],
            left: [0, -1],
            right: [0, 1],
            topRight: [-1,1],
            topLeft: [-1, -1],
            bottomRight: [1, 1],
            bottomLeft: [1, -1],
        }
        if(this.blocks[rowIndex] == undefined) return;
        this.blocks[rowIndex][colIndex].revealed = this.blocks[rowIndex][colIndex].content == 'mine' ? false : true;
        let maxRange = this.difficultlies[this.level].no_mines_radius;

        for(let direction in mapBlock) {
            let nextRowIndex = rowIndex + mapBlock[direction][0];    
            let nextColIndex = colIndex + mapBlock[direction][1];    

            let block_count_x = this.difficultlies[this.level].block_count_x - 1;
            let block_count_y = this.difficultlies[this.level].block_count_y - 1;

            if(direction == 'top' &&  rowIndex == 0) continue;
            else if(direction == 'left' &&  colIndex == 0) continue;
            else if(direction == 'right' &&  colIndex == block_count_x) continue;
            else if(direction == 'bottom' &&  rowIndex == block_count_y) continue;
            else if(direction == 'topRight' &&  (rowIndex == 0 || colIndex == block_count_x)) continue;
            else if(direction == 'topLeft' &&  (rowIndex == 0 || colIndex == 0)) continue;
            else if(direction == 'bottomRight' &&  (rowIndex == block_count_y || colIndex == block_count_x)) continue;
            else if(direction == 'bottomLeft' &&  (rowIndex == block_count_y || colIndex == 0)) continue;

            let nextBlock = this.blocks[rowIndex + mapBlock[direction][0]][colIndex + mapBlock[direction][1]];

            if(nextRowIndex < 0 || 
                nextRowIndex > block_count_y ||
                nextColIndex < 0 ||
                nextColIndex > block_count_x ) return;
            else if(nextBlock.revealed) continue ;
            else if(nextBlock.content == "mine") continue;
            else if(!nextBlock.revealed && Number.isInteger(nextBlock.content)) nextBlock.revealed = true;
            else if(rangeNo < maxRange) this.go(nextRowIndex, nextColIndex, rangeNo++)
            else return;
            
        }

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
                        mousePosition.y <= col.y + that.blockSettings.height &&
                        that.blocks[indexRow][indexCol].revealed == false) {
                        if(!this.firstClick) {
                            that.generateMines(indexRow, indexCol)
                            that.go(indexRow,indexCol,0, true)
                            this.firstClick = true;
                        }else{
                            if(that.blocks[indexRow][indexCol].content == 'mine') {
                                that.gameOver = true;
                                console.log(this.gameOver)
                                alert('Game Over!')
                                return;
                            }else{
                                that.go(indexRow,indexCol,0, false)
                            }
                            that.checkWin()
                        }
                        console.log('clicked at ',col)
                    }
                })
            }) 
        })
    }
    checkWin() {
        let resultBlock = this.blocks.filter(block => !block.every(b => (b.revealed && b.content !== 'mine') || (!b.revealed && b.content == 'mine')))
        console.log(resultBlock)
        if(resultBlock.length == 0) 
            alert('win')
    }
}