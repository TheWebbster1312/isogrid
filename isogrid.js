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
let reorderTiles = true;
let cameraVector = colVector([1, 1, 1])
let blockSpaceOrientation = 0;

function rotate()
{
    if(blockSpaceOrientation == 3)
    {
        blockSpaceOrientation = 0;
    }
    else
    {
        blockSpaceOrientation++;
    }
    updateTiles();
}


function keypressHandler(e){
    switch(e.which)
    {
        // R for rotate
        case 114:
            for(const element of tiles)
            {
                element.rotate();
            }
            break;
        
        // P for mouse coords
        case 112:
            console.log(mouse)
            console.log(blockSpace.get(...mouseTile.getCoords()).getInfo())
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

function updateTiles()
{
    for(const element of tiles)
    {
        element.checkVisablity();
    }  
}


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
        [this.x, this.y] = toXY(this.i, this.j, this.size);
        this.orderPriority = this.y + (this.k*canvas.height);
        this.sprite = sprite;
        this.updated = false;
        this.visable = true;
    }

    getCoords()
    {
        return [this.i, this.j, this.k];
    }

    getInfo()
    {
        return {
            i: this.i,
            j: this.j,
            k: this.k,
            x: this.x,
            y: this.y,
            z: this.z,
            sprite: this.getSprite(),
            visable: this.visable
           };
    }

    getVectorCoords()
    {
        return colVector(this.getCoords());
    }

    getSprite()
    {
        return this.sprite.currentSrc.replace(this.sprite.baseURI, "")
    }

    updateCoords(i, j, k = 0)
    {
        if(i != this.i || j != this.j || k != this.k)
        {
            this.i = i;
            this.j = j;
            this.k = k;
            this.updated = true;
            reorderTiles = true;
        }
    }

    deltaZ(d)
    {
        this.k += d;
        this.z = (this.k * this.size / 2);
    }

    rotate()
    {
        if(!reorderTiles) // if false make ture
        {
            reorderTiles = true;
        }
        this.updated = true
        let vector_coord = colVector([this.i, this.j]);
        let transformed_coord_vector = RotationMatrix.multiply(vector_coord);
        blockSpace.set(...this.getCoords(), null)

        [this.i, this.j] = transformed_coord_vector.getCol(0);

        blockSpace.set(...this.getCoords(), this);

        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size)
    }

    checkVisablity()
    {
        let intersections = this.lineTo(cameraVector);
        if(intersections.length > 0)
        {
            this.visable = false;
        }
        else
        {
            this.visable = true;
        }

    }

    draw() 
    {
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size)
        this.y -= this.z
        this.updated = false;
        c.drawImage(this.sprite, this.x, this.y); 
    }

    update()
    {
        this.orderPriority = this.y + (this.k*canvas.height);
        this.checkVisablity();
        this.draw();
    }

    lineTo(vector)
    {
        let pathHead = this.getVectorCoords().add(vector);
        
        let atEdge = false;

        let intersections = [];

        while(!atEdge)
        {
            atEdge = blockSpace.atEdge(pathHead);
            target = blockSpace.get(...pathHead.getCol(0));
            if(target != null)
            {
                intersections.push(target);
            }
            pathHead = pathHead.add(vector);
        }
        
        return intersections;
    }
}

let mouseTile = new Tile(0, 0, 0, mouseSprite);

// tile grid stuff.

class BlockSpace
{
    constructor()
    {
        this. iMax = 20;
        this.jMax = 20;
        this.kMax = 20;
        this.iMin = -20;
        this.jMin = -20;
        this.kMin = -20;

        this.iSize = Math.abs(this.iMax) + Math.abs(this.iMin);
        this.jSize = Math.abs(this.jMax) + Math.abs(this.jMin);
        this.kSize = Math.abs(this.kMax) + Math.abs(this.kMin);

        this.space = []
        this.tile

        for (let step = 0; step < this.kSize + 1; step++)
        {
            this.space[step] = new TileMatrix(this.iSize, this.jSize);
        }
    }

    get(i, j, k)
    {
        if(!this.atEdge(colVector([i, j, k])))
        {
            return this.space[k - this.kMin].get(i - this.iMin, j - this.jMin);
        }
    }

    getMaxVector()
    {
        return colVector([this.iMax, this.jMax, this.kMax]);
    }

    getMinVector()
    {
        return colVector([this.iMin, this.jMin, this.kMin]);
    }

    getTop(i, j)
    {
        for (let step = this.kSize; step > -1; step--)
        {
            let target = this.get(i, j, step + this.kMin)
            if(target != null)
            {
                return target;
            }
        }
        return null;
    }

    set(i, j, k, item)
    {
        this.space[k - this.kMin].set(i - this.iMin, j - this.jMin, item);
    }
    
    show()
    {
        for (let step = this.kSize; step > -1; step--)
        {
            let target = this.space[step]
            if(!target.isNull) //  if the tilematrix is populated
            {
                console.log(step + this.kMin)
                target.show();
            }
        }
    }

    atEdge(vector)
    {
        let returnBool = false;

        if(this.getMaxVector().get(0, 0) < vector.get(0, 0)) {returnBool = true};
        if(this.getMaxVector().get(1, 0) < vector.get(1, 0)) {returnBool = true};
        if(this.getMaxVector().get(2, 0) < vector.get(2, 0)) {returnBool = true};

        if(this.getMinVector().get(0, 0) > vector.get(0, 0)) {returnBool = true};
        if(this.getMinVector().get(1, 0) > vector.get(1, 0)) {returnBool = true};
        if(this.getMinVector().get(2, 0) > vector.get(2, 0)) {returnBool = true};

        return returnBool;
    }
}


let blockSpace = new BlockSpace();



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
                let tile = new Tile(i, j, k, sprite)
                tiles.push(tile);
                blockSpace.set(i, j, k, tile)
            }
        }
    }
}

//drawSquare(-10, 9, -10, 10, -1, 0);
//drawSquare(-10, 10, -10, -9, 0, 10)

addTiles(0, 1, 2, 1, 1, 1, grassSprite)
addTiles(0, 1, 1, 1, 1, 1, spriteSprite)
addTiles(0, 10, 1, 1, 1, 1, spriteSprite)
addTiles(10, 0, 1, 1, 1, 1, spriteSprite)



addTiles(-5, -5, 0, 10, 10, 1);


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
        reorderTiles = false;
    }
    else
    {
        drawArray = tiles;
    }
    drawArray = sortOrderPriority(tiles);
    
    for(const element of drawArray)
    {
        element.draw();
    }
    mouseTile.draw();
}

updateTiles();

animateFrame();
