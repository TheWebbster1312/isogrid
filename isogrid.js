var canvas = document.getElementById("Canvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keypress", keypressHandler);

const IJScalerMatrix = new Matrix(2, 2, [-0.5, 0.5, 0.25, 0.25]);
const XYScalerMatrix = IJScalerMatrix.invert();
const RotationMatrix = new Matrix(2, 2, [0, -1, 1, 0]);
const offset = new Matrix(2, 1, [canvas.width/2, canvas.height/2]);
offset.toInt();
var reorderTiles = false;

function keypressHandler(e){
    switch(e.which)
    {
        case 114:
            for(const element of tiles)
            {
                element.rotate();
                reorderTiles = true;
            }
            break;
        default:
            console.log("not recognised")
    }
}

const stoneSprite = new Image();
stoneSprite.src = "stone.bmp";

const spriteSprite = new Image();
spriteSprite.src = "sprite.bmp";

const grassSprite = new Image();
grassSprite.src = "grass.bmp";

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

    xyMat = new Matrix(2, 1, [x, y]).sub(offset);

    return convertionMat.multiply(xyMat);
}

var c = canvas.getContext("2d")

class Tile{
    constructor(i, j, k = 0, sprite = stoneSprite) 
    {
        this.i = i;
        this.j = j;
        this.k = k;
        this.size = 32; 
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size, offset)
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
            this.changed = true
        }
    }
    deltaZ(d)
    {
        this.k += d;
        this.z = (this.k * this.size / 2);
    }
    rotate()
    {
        this.changed = true
        var vector_coord = new Matrix(2, 1, [this.i, this.j]);
        var transformed_coord_vector = RotationMatrix.multiply(vector_coord);

        [this.i, this.j] = transformed_coord_vector.getCol(0);

        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size, offset)
        this.orderPriority = this.y + (this.k*canvas.height);
    }
    draw() 
    {
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size, offset);
        this.y -= this.z;

        c.drawImage(this.sprite, this.x, this.y); 
    }
    update()
    {
        this.draw();
    }
}

var tiles = []

function drawSquare(iStart, iEnd, jStart, jEnd, kStart = 0, kEnd = 0, sprite = stoneSprite)
{
    for(var j = jStart; j < jEnd + 1; j++)
    {
        for(var i = iStart; i < iEnd + 1; i++)
        {
            for(var k = kStart; k < kEnd + 1; k++){
                tiles.push(new Tile(i, j, k, sprite));
            }
        }
    }
}

drawSquare(-10, 9, -10, 10, -1, 0);
//drawSquare(-10, 10, -10, -9, 0, 10)
drawSquare(0, 2, -1, 2, 1, 1, spriteSprite)
grassTile = new Tile(0, 1, 2, grassSprite)
redTile = new Tile(0, 1, 1, spriteSprite)
redTile2 = new Tile(0, 10, 1, spriteSprite)
redTile3 = new Tile(9, 1, 1, spriteSprite)
mouseTile = new Tile(0, 0, 0, grassSprite)
tiles.push(grassTile)
tiles.push(redTile)
tiles.push(redTile2)
tiles.push(redTile3)
drawSquare(2, 2, 2, 2, 2, 2)
drawSquare(-11, 10, 11, 11, 0, 5)
drawSquare(10, 10, -11, 11, 0, 5)
//drawSquare(-11, -11, -11, 11, 0, 15)

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
    requestAnimationFrame(animateFrame);
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
    
    for(const element of drawArray)
    {
        element.draw();
    }
    mouseTile.draw();
}

animateFrame();
