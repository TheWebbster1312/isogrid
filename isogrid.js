let canvas = document.getElementById("Canvas")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener("keypress", keypressHandler);

const IJScalerMatrix = new Matrix(2, 2, [-0.5, 0.5, 0.25, 0.25]);
const XYScalerMatrix = IJScalerMatrix.invert();
const RotationMatrix = identityMatrix(2);
const RotationMatrix3D = identityMatrix(3);
const RotationMatracies = [RotationMatrix, RotationMatrix3D];
const offset = new Matrix(2, 1, [canvas.width/2, canvas.height/2]);
offset.toInt();
const c = canvas.getContext("2d")
let reorderTiles = true;
let cameraVector = new ColumnVector(3, [1, 1, 1])
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
    update_rotation_matrix();
    updateTiles(blockSpace.getDataFlat());
}

function update_rotation_matrix()
{
    for(const m of RotationMatracies)
    {
        m.set(0, 0, Math.round(Math.cos((Math.PI * blockSpaceOrientation)/2)));
        m.set(0, 1, Math.round(Math.sin((Math.PI * blockSpaceOrientation)/2)));
        m.set(1, 0, Math.round(-Math.sin((Math.PI * blockSpaceOrientation)/2)));
        m.set(1, 1, Math.round(Math.cos((Math.PI * blockSpaceOrientation)/2)));
    }
}



function clearScreen()
{
    c.clearRect(0,0,canvas.width, canvas.height);
}


function keypressHandler(e){
    switch(e.which)
    {
        // R for rotate
        case 114:
            rotate();

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

function updateTiles(data)
{
    for(const element of data)
    {
        element.update();
    }  
}


function toXY(i, j, size)
{
    let convertionMat = IJScalerMatrix.multiply(size);
    
    let ijMat = new Matrix(2, 1, [i, j]);
    ijMat = RotationMatrix.multiply(ijMat);
    
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
    constructor(i, j, k = 0, sprite = stoneSprite, parent) 
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
        this.blockSpace = parent
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

    checkVisablity() // efectively cheking lineto camera
    {
        // off screen check
        if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height)
        {
            this.visable = false;
            
        }
        else
        {
            this.visable = true;
        }

        // old code to check if tiles are covered by other tiles
        // proved more taxing than it was worth. Kepping in incase i find it useful
        // let vector = RotationMatrix3D.invert().multiply(cameraVector);
        // let intersections = this.lineTo(vector);

        // if(intersections.length > 0)
        // {
        //     this.visable = false;
        // }
        // else
        // {
        //     this.visable = true;
        // }

    }

    draw() 
    {
        c.drawImage(this.sprite, this.x, this.y); 
    }

    update()
    {
        this.z = this.k * this.size / 2;
        [this.x, this.y] = toXY(this.i, this.j, this.size)
        this.y -= this.z
        this.updated = false;
        this.orderPriority = this.y + (this.k*canvas.height);
        //this.checkVisablity();
    }

    lineTo(vector)
    {
        let pathHead = this.getVectorCoords().add(vector);
        
        let atEdge = false;

        let intersections = [];

        while(!atEdge)
        {
            atEdge = this.blockSpace.atEdge(pathHead);
            target = this.blockSpace.get(...pathHead.getCol(0));
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
        this. iMax = 100;
        this.jMax = 100;
        this.kMax = 100;
        this.iMin = -100;
        this.jMin = -100;
        this.kMin = -100;

        this.iSize = Math.abs(this.iMax) + Math.abs(this.iMin);
        this.jSize = Math.abs(this.jMax) + Math.abs(this.jMin);
        this.kSize = Math.abs(this.kMax) + Math.abs(this.kMin);

        this.space = [];
        
        this.visable = true;

        this.areaInView = 
        {
            iStart: this.iMin,
            iEnd: this.iMax,
            jStart: this.jMin,
            jEnd: this.jMax
        }
        this.updateVisableArea();
        
        // each step is a vertical layer
        for (let step = 0; step < this.kSize + 1; step++)
        {
            this.space[step] = new TileMatrix(this.iSize, this.jSize);
        }
    }

    setVisability(visablility)
    {
        this.visable = visablility;
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

    addTiles(i_, j_, k_ = 0, di = 1, dj = 1, dk = 1, sprite = stoneSprite)
    {
        for(let i = i_; i < (i_ + di); i++)
        {
            for(let j = j_; j < (j_ + dj) ; j++)
            {
                for(let k = k_; k < (k_ + dk); k++)
                {
                    let tile = new Tile(i, j, k, sprite, this)
                    tiles.push(tile);
                    this.set(i, j, k, tile)
                }
            }
        }
    }

    getData()
    {
        let returnData = [];
        for(let layer = 0; layer < this.kSize; layer++)
        {
            if(this.space[layer].isNull) {continue;}

            returnData.push(this.space[layer].getData().filter(Boolean));
        }

        return returnData;
    }

    getDataIn(iStart, iEnd, jStart, jEnd)
    {
        let returnData = [];
        for(let layer = 0; layer < this.kSize; layer++)
        {
            if(this.space[layer].isNull) {continue;}

            returnData.push(this.space[layer].getDataIn(iStart - this.iMin, jStart - this.jMin, iEnd - this.iMin, jEnd- this.jMin).filter(Boolean));
        }

        return returnData;
    }

    getDataFlat()
    {
        let returnData = [];
        for(let layer of this.getData())
        {
            returnData = returnData.concat(layer);
        }

        return returnData;
    }


    draw()
    {
        //Start from bottom slice
        for(const layer of this.getDataIn(this.areaInView.iStart, this.areaInView.iEnd, this.areaInView.jStart, this.areaInView.jEnd))
        {
            this.draw_layer(layer)
        }
    }

    draw_layer(layer)
    {
        let orderedLayerList = sortOrderPriority(layer);

        for(const item of orderedLayerList)
        {
            if(item.visable)
            {
                item.draw();
            }
        }
    }

    lineTo(startingCoord, vector)
    {
        let pathHead = startingCoord.add(vector);
        
        let atEdge = false;

        let intersections = [];

        while(!atEdge)
        {
            atEdge = this.atEdge(pathHead);
            target = this.blockSpace.get(...pathHead.getCol(0));
            if(target != null)
            {
                intersections.push(target);
            }
            pathHead = pathHead.add(vector);
        }
        
        return intersections;
    }

    updateVisableArea()
    {
        let [i, j] = toIJ(0, canvas.height/2, true).getCol(0);
        console.log(i, j)
        this.areaInView.iStart = i-1;
        this.areaInView.jStart = j-1;

        [i, j] = toIJ(canvas.width, canvas.height/2, true).getCol(0);
        console.log(i, j)
        this.areaInView.iEnd = i+1;
        this.areaInView.jEnd = j+1;
        
    }

    getmaxNumberOfBlocksPerLayer()
    {
        let dx = this.areaInView.iEnd - this.areaInView.iStart
        let dy = this.areaInView.jEnd - this.areaInView.jStart

        return dy * dy;
    }
    
    lineToFrom(startingCoord, endingCoord)
    {

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

//drawSquare(-10, 9, -10, 10, -1, 0);
//drawSquare(-10, 10, -10, -9, 0, 10)

blockSpace.addTiles(0, 1, 2, 1, 1, 1, grassSprite);
blockSpace.addTiles(0, 1, 1, 1, 1, 1, spriteSprite);
blockSpace.addTiles(0, 10, 1, 1, 1, 1, spriteSprite);
blockSpace.addTiles(10, 0, 1, 1, 1, 1, stoneSprite);

blockSpace.addTiles(blockSpace.iMin, blockSpace.jMin, -1, blockSpace.iSize, blockSpace.jSize, 1, grassSprite);

blockSpace.addTiles(-5, -5, 0, 10, 10, 1);


// drawSquare(-11, -11, -11, 11, 0, 15)

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

updateTiles(blockSpace.getDataFlat());

