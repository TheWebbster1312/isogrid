var canvas = document.getElementById("Canvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keypress", keypressHandler);

const IJScalerMatrix = new Matrix(2, 2, [-0.5, 0.5, 0.25, 0.25]);
const XYScalerMatrix = IJScalerMatrix.invert();
const RotationMatrix = new Matrix(2, 2, [0, -1, 1, 0]);
const offset = new Matrix(2, 1, [canvas.width/2, canvas.height/2])
offset.toInt()

function keypressHandler(e){
    switch(e.which)
    {
        case 114:
            for(const element of tiles)
            {
                element.rotate();
            }
            animateFrame();
            break;
        default:
            console.log("not recognised")
    }
}

const stoneSprite = new Image();
stoneSprite.src = "stone.png";

const spriteSprite = new Image();
spriteSprite.src = "sprite.png";

const grassSprite = new Image();
grassSprite.src = "grass.png";

function toXY(i, j, size)
{
    let convertionMat = IJScalerMatrix.multiply(size);
    
    let ijMat = new Matrix(2, 1, [i, j]);
    
    return convertionMat.multiply(ijMat).add(offset).getCol(0);
}

function toIJ(x, y)
{
    let convertionMat = XYScalerMatrix.multiply(1/32);

    xyMat = new Matrix(2, 1, [x, y]).sub(offset);
    
    return convertionMat.multiply(xyMat);
}

var c = canvas.getContext("2d")

class Tile{
    constructor(i, j, k = 0, sprite = stoneSprite) {
        this.i = i;
        this.j = j;
        this.k = k;
        this.size = 32; 
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size, offset)
        this.orderPriority = this.y + (this.k*canvas.height);
        this.sprite = sprite
    }
    deltaZ(d)
    {
        this.k += d;
        this.z = (this.k * this.size / 2);
    }
    rotate()
    {
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
        [this.x, this.y] = toXY(this.i, this.j, this.size, offset)
        this.y -= this.z
    
        c.drawImage(this.sprite, this.x, this.y); 
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
tiles.push(grassTile)
tiles.push(redTile)
tiles.push(redTile2)
tiles.push(redTile3)
drawSquare(2, 2, 2, 2, 2, 2)
drawSquare(-11, 10, 11, 11, 0, 15)
drawSquare(10, 10, -11, 11, 0, 15)
//drawSquare(-11, -11, -11, 11, 0, 15)

function orderPrioritise(entities)
{
    let threshold = entities[Math.floor(entities.length/2)]
    let bigger = []
    let smaller = []
    if(entities.length == 1)
    {
        return entities;
    }
    for(const element of entities)
    {
        if(element < threshold)
        {
            smaller.unshift(element)       
        }
        else if(element == threshold)
        {
            smaller.push(element)
        }
        else
        {
            bigger.push(element)
        }
    }
    if(bigger.length == 0 && smaller.length != 0)
    {
        return smaller
    }
    else if (bigger.length != 0 && smaller.length == 0)
    {
        return bigger
    }
    else
    {
        return orderPrioritise(smaller).concat(orderPrioritise(bigger));
    }
}
function sortOrderPriority(nums_)
{
    let nums = copyList(nums_);
    nums.sort(function(a, b) {
        if ( a.orderPriority < b.orderPriority ){
            return -1;
          }
          if ( a.orderPriority > b.orderPriority ){
            return 1;
          }
          return 0;
    });
    return nums;
}



function animateFrame()
{
    c.clearRect(0,0,canvas.width, canvas.height);
    drawArray = sortOrderPriority(tiles)
    console.log(drawArray)
    for(const element of drawArray)
    {
        element.draw();
    }
}

animateFrame()

function randomGen(n)
{
    let nums = [];
    for(let i = 0; i < n; i++)
    {
        nums.push(Math.round(Math.random()*10000))
    }
    return nums;
}

nums = randomGen(1000)

