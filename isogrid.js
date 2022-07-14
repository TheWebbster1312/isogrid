var canvas = document.getElementById("Canvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keypress", keypressHandler);

function keypressHandler(e){
    switch(e.which)
    {
        case 114:
            for(const element of tiles)
            {
                element.rotate();
            }
            tiles = orderPrioritise(tiles)
            animateFrame();
            break;
        default:
            console.log("not recognised")
    }
}

var stoneSprite = new Image();
stoneSprite.src = "stone.png";

offset = new Matrix(2, 1, [canvas.width/2, canvas.height/2])

function toXY(i, j, size, offset = 0)
{
    var convertionMat = new Matrix(2, 2, [-0.5, 0.5, 0.25, 0.25]);
    convertionMat = convertionMat.multiply(size);
    
    var ijMat = new Matrix(2, 1, [i, j]);
    
    if(offset != 0)
    {
        return convertionMat.multiply(ijMat).add(offset).getCol(0)
    }
    else
    {
        return convertionMat.multiply(ijMat).getCol(0)
    }

    

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
        this.z = this.k * this.size / 2;
    }
    rotate()
    {
        var vector_coord = new Matrix(2, 1, [this.i, this.j]);
        var rotation_vector = new Matrix(2, 2, [0, -1, 1, 0]);
        var transformed_coord_vector = rotation_vector.multiply(vector_coord);

        [this.i, this.j] = transformed_coord_vector.getCol(0);

        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size, offset)
        this.orderPriority = this.y + (this.k*canvas.height);
    }
    draw() 
    {
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size, offset)
    
        c.drawImage(this.sprite, this.x, this.y); 
    }
}

var tiles = []

function drawSquare(iStart, iEnd, jStart, jEnd, kStart = 0, kEnd = 0)
{
    for(var j = 0; j < jEnd-jStart; j++)
    {
        for(var i = 0; i < iEnd-iStart; i++)
        {
            for(var k = 0; k <= kEnd-kStart; k++){
                tiles.push(new Tile(iStart + i, jStart + j, kStart + k));
            }
            
        }
    }
}

drawSquare(-10, 10, -10, 10);
drawSquare(-10, 10, -10, -9, 0, 10)
tiles.push(new Tile(1, 1, 1));
tiles.push(new Tile(1, 2, 1));
tiles.push(new Tile(1, 3, 1));
tiles.push(new Tile(2, 1, 1));
tiles.push(new Tile(2, 2, 1));
tiles.push(new Tile(2, 3, 1));
tiles.push(new Tile(3, 1, 1));
tiles.push(new Tile(3, 2, 1));
tiles.push(new Tile(3, 3, 1));
tiles.push(new Tile(2, 2, 2));
tiles.push(new Tile(1, 2, 2));


function orderPrioritise(entities)
{
    var threshold = entities[Math.floor(entities.length/2)].orderPriority
    var bigger = []
    var smaller = []
    if(entities.length == 1)
    {
        return entities;
    }
    for(const element of entities)
    {
        if(element.orderPriority < threshold)
        {
            smaller.unshift(element)       
        }
        else if(element.orderPriority == threshold)
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
function animateFrame()
{
    c.clearRect(0,0,canvas.width, canvas.height);
    tiles = orderPrioritise(tiles);
    for(const element of tiles)
    {
        element.draw();
    }
}

animateFrame()
