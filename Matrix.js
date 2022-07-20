//Matracies

function arMultiply(ar1, ar2)
{   
    var sumation = 0
    for(var i = 0; i < ar1.length; i++)
    {
        sumation = sumation + (ar1[i]*ar2[i])
    }
    return sumation
}

function sum(data)
{
    var sumation = 0;
    //sumation a list
    for(const element of data)
    {
        sumation += element;
    }
    return sumation;
}

function linearOperation(mA, mB, op = "*")
{
    let newM = new Matrix(mA.nrow, mA.ncol);

    // valaidation
    if(mA.nrow != mB.nrow)
    {
        console.log("matracies are not the same dimension");
        return null;
    }
    if(mA.ncol != mB.ncol)
    {
        console.log("matracies are not the same dimension");
        return null;
    }

    for(let r = 0; r < mA.nrow; r++)
    {
        for(let c = 0; c < mA.ncol; c++)
        {
            if(op == "*")
            {
                newM.m[r][c] = mA.m[r][c] * mB.m[r][c];
            }
            else
            {
                newM.m[r][c] = mA.m[r][c] / mB.m[r][c];
            }
        }
    }

    return newM;
}

function guasianElimination(m1, m2)
{
    
}

function leadingEntryScale(m_, ma_)
{
    // the reason for these copyMatrix statements is so that we dont change the original matrix, we return a copy thats been changed
    let m = copyMatrix(m_);
    let ma = copyMatrix(ma_);
    // this function can only scale a matrix that is already in REF

    // leading entries to 1

    for(let i = 0; i < m.nrow; i++)
    {
        // goes through each row

        // grabs the diagonal (should be first entry)
        let scaler = m.get(i, i);

        if(scaler == 0)
        {
            continue;
        }

        // divides all numbers in row by the leading entry
        for(let j = 0; j < (m.nrow - i); j++)
        {
            target = m.get(i, i + j);
            target = target / scaler;
            m.set(i, i + j, target);
        }
        // augmented matrix
        for(let j = 0; j < ma.ncol; j++)
        {
            target = ma.get(i, j);
            target = target / scaler;
            ma.set(i, j, target)
        }
    }
    return [m, ma];
}

function flip_vert(m)
{
    let mNew = new Matrix(m.nrow, m.ncol);

    for(let i = 0; i < m.nrow; i++)
    {
        let j = m.nrow- 1 - i;
        mNew.setRow(j, m.getRow(i));
    }

    return mNew;
}

function REFConvert(m_, ma_)
{
    let m = copyMatrix(m_);
    let ma = copyMatrix(ma_);
    let keepGoing = true;
    let col = 0 // start at col 1
    let row = 1 // starts at second row
    let target, diagRef, rowMultiplier;
    let originalRank = m.getRank();
    // console.log(originalRank)

    while(keepGoing)
    {
        // goes row by row
        // console.log(row, col)
        target = m.get(row, col); // the number to be zeroed
        diagRef = m.get(col, col); // the operation number on the diag

        rowMultiplier = (target / diagRef);

        let targetRow = m.getRow(row);
        let aTargetRow = ma.getRow(row);
        let refRow = m.getRow(col);
        let aRefRow = ma.getRow(col);
        // console.log(aRefRow)
        // console.log(aTargetRow)

        // column by column within row
        for(let i = 0; i < m.ncol; i++)
        {
            // The main matrix
            m.set(row, i, (targetRow[i] - (rowMultiplier * refRow[i])));
        }
        for(let i = 0; i < ma.ncol; i++)
        {           
            // The augmented part of the matrix
            ma.set(row, i, (aTargetRow[i] - (rowMultiplier * aRefRow[i])));
        }

        // debugging
        //console.log(target, diagRef, rowMultiplier)
        // m.show()
        // ma.show()
    
        // progression and stopping 
        if((row + 1)  < m.nrow)
        {
            row = row + 1;
        }
        else
        {
            col = col + 1;
            row = col + 1;
        }

        if (col > (m.ncol - 2) && row > (m.nrow - 2))
        {
            // should stop when it reaches the last diagonal
            keepGoing = false;   
        }
    }

    let newRank = m.getRank();

    if(newRank != originalRank)
    {
        console.log("Matrix Not invertable!")
        return null;
    }
    return [m, ma];
}

function RREFConvert(m_, ma_)
{
    let m = copyMatrix(m_);
    let ma1 = copyMatrix(ma_);
    let ma2 = copyMatrix(ma_);

    console.log("+++++++++++Getting into leading entry REF++++++++++");
    let REFs = REFConvert(m, ma1);
    m = REFs[0];
    ma1 = REFs[1];
    [m, ma1] = leadingEntryScale(m, ma1);

    console.log("+++++++++++Transposing++++++++++");
    m = m.transpose();

    console.log("+++++++++++upper triangle++++++++++");
    [m, ma2] = REFConvert(m, ma2);

    console.log("++++++++++Calculating results+++++++++++");

    ma1 = linearOperation(ma1, ma2, "/")

    m.show();
    ma1.show();

    return [m, ma1]

}

class Matrix
{
    constructor (nrow, ncol, data = null)
    {   
        this.nrow = nrow;
        this.ncol = ncol;
        this.capacity = (ncol * nrow);
        this.m = [];
        
        // making null matrix
        if(data == null)
        {
            for(let i = 0; i < nrow; i++)
            {
                this.m[i] = [];
                for(let j = 0; j < ncol; j++)
                {
                    this.m[i][j] = null;
                }
            }
        }
        //making non null matrix
        else
        {
            for(let i = 0; i < nrow; i++)
            {
                this.m[i] = [];
                for(let j = 0; j < ncol; j++)
                {
                    this.m[i][j] = data[(i * ncol) + j];
                }
            }
        }
    }
    // object functions
    show()
    {
        let content = "";
        for(const element of this.m)
        {
            content += (element.toString() + "\n");
        }

        console.log(content)
    }

    get(row, col)
    {
        return  this.m[row][col]
    }

    getRow(row)
    {
        return this.m[row]
    }

    getCol(col)
    {
        return this.m.map(function(value, index){return value[col]});
    }

    getData()
    {
        let data = [];
        for(let i = 0; i < this.nrow; i++)
        {
            data = data.concat(this.getRow(i));
        }
        return data;
    }

    set(row, col, data)
    {
        this.m[row][col] = data;
    }

    setRow(row, data)
    {
        // validation
        if(data.length != this.ncol)
        {
            return null;
        }
        
        if(row - 1 > this.nrow)
        {
            return null;
        }

        // setting row
        for(let i = 0; i < this.ncol; i++)
        {
            this.m[row][i] = data[i];
        }
    }

    setCol(col, data)
    {
        // validation
        if(data.length != this.nrow)
        {
            return null;
        }
        
        if(col - 1 > this.nrow)
        {
            return null;
        }

        // setting col
        for(let i = 0; i < this.nrow; i++)
        {
            this.m[i][col] = data[i];
        }
    }

    sumRow(row)
    {
        // validatiom
        if(row - 1 > this.nrow)
        {
            return null;
        }

        return sum(this.getRow(row));
    }

    sumCol(col)
    {
        // validatiom
        if(col - 1 > this.ncol)
        {
            return null;
        }

        return sum(this.getCol(col));
    }

    sum()
    {
        let theSum= 0;

        for(let i = 0; i< this.nrow; i++)
        {
            theSum+= this.sumRow(i);
        }

        return sum
    }
    
    transpose()
    {
        let newM = new Matrix(this.ncol, this.nrow);

        for(let i = 0; i < this.nrow; i++)
        {
            newM.setCol(i, this.getRow(i));
        }
        return newM;
    }

    multiply(m2)
    {
        if (typeof(m2) == "number" ){
            // scaling a amtrix by an intager
            let newData = [];
            let r, c;
            for(let i = 0; i < this.capacity; i++)
            {
                r = Math.floor(i%this.nrow);
                c = Math.floor(i/this.ncol);
                newData[i] = this.m[r][c]*m2;
            }
            return new Matrix(this.nrow, this.ncol, newData);
        }
        else if(this.ncol == m2.nrow)
        {
            //multipkying a matrix by another matrix
            let newSize = this.nrow * m2.ncol;
            let newData = [];
            let r, c;
            for(let i = 0; i < newSize; i++)
            {
                r = Math.floor(i%this.nrow)
                c = Math.floor(i/m2.nrow)
                let row1 = this.getRow(r);
                let col2 = m2.getCol(c);
                newData[i] = arMultiply(row1, col2);
            }
            return new Matrix(this.nrow, m2.ncol, newData);

        }
        else
        {
            return null;
        }
    }
    add(m2)
    {
        if(m2.ncol == this.ncol && m2.nrow == this.nrow)
        {
            // for intager multiplication
            let newData = [];
            let i = 0;
            for(let c = 0; c < this.ncol; c++)
            {
                for(let r = 0; r < this.nrow; r++)
                {
                    //console.log("wow", r, c)
                    newData[i] = this.m[r][c] + m2.m[r][c];
                    i++;
                }
            }
            return new Matrix(this.nrow, this.ncol, newData);
        }
        else
        {
            console.log("Matricies need to be of same dimension")
            return null;
        }
    }

    getRank()
    {
        let rank = 0;
        for(let i = 0; i < this.nrow; i++)
        {
            if(sum(this.getRow(i)) != 0) rank += 1;
        }

        return rank;
    }
}

function copyMatrix(m)
{
    return new Matrix(m.nrow, m.ncol, m.getData());
}

let m1 = new Matrix(2, 2, [0, -1, 1, 0]);
let m2 = new Matrix(2, 2, [4, 6, 1, 1]);
let m3 = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 8, 8, 9]);
let m4 = new Matrix(3, 1, [14, 32, 51]);
let unitM = new Matrix(3, 3, [1, 1, 1, 1, 1, 1, 1, 1, 1]);
let unitMa = new Matrix(3, 1, [1, 1, 1]);
let idm = new Matrix(3, 3, [1, 0, 0, 0, 1, 0, 0, 0, 1])

// m3.show();
// m4.show();

// flip_vert(m3).show()
// flip_vert(m4).show()

// let refM3, refM4;

// let tmp = REFConvert(m3, m4)
// refM3 = tmp[0];
// refM4 = tmp[1];


// tmp = leadingEntryScale(refM3, refM4)
// refM3 = tmp[0];
// refM4 = tmp[1];

// refM3.show()
// refM4.show()

// tmp = REFConvert(refM3.transpose(), m4)
// refM3 = tmp[0];
// let refM42 = tmp[1];

// refM3.show()
// refM42.show()

// linearOperation(refM4, refM42, "/").show()




// m4.transpose().show()
let [m5, m6] = RREFConvert(m3, idm);

m5.show();
m6.show();



//m3.transpose().show()

// let augmentedMatrix = REFConvert(m3, m4)
// leadingEntryScale(augmentedMatrix[0], augmentedMatrix[1])


// m3.show();
// m4.show();

// console.log(m1)
// console.log(m2)

//console.log(m1.add(m2))