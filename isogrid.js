let canvas = document.getElementById("Canvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keypress", keypressHandler);

const IJScalerMatrix = new Matrix(2, 2, [-0.5, 0.5, 0.25, 0.25]);
const XYScalerMatrix = IJScalerMatrix.invert();
const RotationMatrix = new Matrix(2, 2, [0, -1, 1, 0]);
const offset = new Matrix(2, 1, [canvas.width/2, canvas.height/2]);
offset.toInt();
const c = canvas.getContext("2d")
let reorderTiles = false;


function keypressHandler(e){
    switch(e.which)
    {
        // R for rotate
        case 114:
            for(const element of tiles)
            {
                element.rotate();
                reorderTiles = true;
            }
            animateFrame();
            break;
        
        // P for mouse coords
        case 112:
            console.log(mouse)
            break;
        default:
            console.log("not recognised")
    }
}

// sprite declarations
const stoneSprite = new Image();
stoneSprite.src = "stone.bmp";

const spriteSprite = new Image();
spriteSprite.src = "sprite.bmp";

const grassSprite = new Image();
grassSprite.src = "grass.bmp";

const mouseSprite = new Image();
mouseSprite.src = "mousesprite.bmp";


function toXY(i, j, size)
{
    let convertionMat = IJScalerMatrix.multiply(size);
    
    let ijMat = new Matrix(2, 1, [i, j]);
    
    return convertionMat.multiply(ijMat).add(offset).getCol(0);
}

function toIJ(x, y, xint = false)
{
    let convertionMat = XYScalerMatrix.multiply(1/32);
    if(!xint){convertionMat.xint = false}

    let xyMat = new Matrix(2, 1, [x, y]).sub(offset);

    return convertionMat.multiply(xyMat);
}

class Tile{
    constructor(i, j, k = 0, sprite = stoneSprite) 
    {
        this.i = i;
        this.j = j;
        this.k = k;
        this.size = 32; 
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size)
        this.orderPriority = this.y + (this.k*canvas.height);
        this.sprite = sprite
        this.updated = false;
    }
    updateCoords(i, j, k = 0)
    {
        if(i != this.i || j != this.j || k != this.k)
        {
            this.i = i;
            this.j = j;
            this.k = k;
            this.updated = true
        }
    }
    deltaZ(d)
    {
        this.k += d;
        this.z = (this.k * this.size / 2);
    }
    rotate()
    {
        this.updated = true
        let vector_coord = new Matrix(2, 1, [this.i, this.j]);
        let transformed_coord_vector = RotationMatrix.multiply(vector_coord);

        [this.i, this.j] = transformed_coord_vector.getCol(0);

        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size)
        this.orderPriority = this.y + (this.k*canvas.height);
    }
    draw() 
    {
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size)
        this.y -= this.z
        this.updated = false;
        c.drawImage(this.sprite, this.x, this.y); 
    }
}

let tiles = []

/**
 * 
 * @param {Number} i_ Start for i coord
 * @param {Number} j_ start for j
 * @param {Number} k_ start for k*
 * @param {Number} di length of 1*
 * @param {Number} dj length of j*
 * @param {Number} dk length of k*
 * * = optional
 * @param {Image} sprite the sprite used* 
 */
function addTiles(i_, j_, k_ = 0, di = 1, dj = 1, dk = 1, sprite = stoneSprite)
{
    for(let i = i_; i < (i_ + di); i++)
    {
        for(let j = j_; j < (j_ + dj) ; j++)
        {
            for(let k = k_; k < (k_ + dk); k++)
            {
                tiles.push(new Tile(i, j, k, sprite));
            }
        }
    }
}

//drawSquare(-10, 9, -10, 10, -1, 0);
//drawSquare(-10, 10, -10, -9, 0, 10)
//drawSquare(0, 2, -1, 2, 1, 1, spriteSprite)
let grassTile = new Tile(0, 1, 2, grassSprite)
let redTile = new Tile(0, 1, 1, spriteSprite)
let redTile2 = new Tile(0, 10, 1, spriteSprite)
let redTile3 = new Tile(9, 1, 1, spriteSprite)
let mouseTile = new Tile(0, 0, 0, mouseSprite)
// tiles.push(grassTile)
// tiles.push(redTile)
// tiles.push(redTile2)
// tiles.push(redTile3)
// drawSquare(2, 2, 2, 2, 2, 2)
// drawSquare(-11, 10, 11, 11, 0, 5)
// drawSquare(10, 10, -11, 11, 0, 5)
//d   rawSquare(-11, -11, -11, 11, 0, 15)

addTiles(-5, -5, 0, 20, 10, 1)
addTiles(-4, -4, 1, 5, 5, 1, spriteSprite)
addTiles(-3, -3, 2, 3, 3, 1, grassSprite)

function sortOrderPriority(nums_)
{
    let nums = copyList(nums_);
    nums.sort(function(a, b) {
        if ( a.orderPriority < b.orderPriority )
        {
            return -1;
          }
          if ( a.orderPriority > b.orderPriority )
          {
            return 1;
          }
          return 0;
    });
    return nums;
}

function animateFrame()
{
    let drawArray;
    c.clearRect(0,0,canvas.width, canvas.height);
    if(reorderTiles)
    {
        drawArray = sortOrderPriority(tiles);
    }
    else
    {
        drawArray = tiles;
    }
    drawArray.push(mouseTile)
    
    for(const element of drawArray)
    {
        if(element.updated)
        {
            element.draw();
        }
    }
}


animateFrame()


