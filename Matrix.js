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
    let a, b;

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
            a = mA.m[r][c];
            b = mB.m[r][c];

            if(a == 0 || b == 0)
            {
                newM.m[r][c] = 0;
            }
            else if(op == "*")
            {
                newM.m[r][c] = a * b;
            }
            else
            {
                newM.m[r][c] = a / b;
            }
        }
    }

    return newM;
}

function swapRows(m_, row1, row2)
{
    let m = copyMatrix(m_);

    let tmp = m.getRow(row1);
    m.setRow(row1, m.getRow(row2));
    m.setRow(row2, tmp);
    
    return m;
}

function identityMatrix(size)
{
    let idm = new Matrix(size, size);

    for(let i = 0; i < size; i++)
    {
        idm.set(i, i, 1)
    }

    return idm;
}

function guasianElimination(m1, m2)
{
    
}

function leadingEntryScale(m_, ma_ = null, t = false)
{
    let m;
    let ma = null;
    // the reason for these copyMatrix statements is so that we dont change the original matrix, we return a copy thats been changed
    if(t)
    {
        m = copyMatrix(m_).transpose();
    }
    else
    {
        m = copyMatrix(m_);
    }
    if(ma_ != null)
    {
        if(t)
        {
            ma = copyMatrix(ma_).transpose();
        }
        else
        {
            ma = copyMatrix(ma_);
        }
    }
    // this function can only scale a matrix that is already in REF

    // leading entries to 1

    for(let i = 0; i < m.nrow; i++)
    {
        // goes through each row

        // grabs the first entry
        let scaler, entry;
        for(let scanLeadingEntry = 0; scanLeadingEntry < m.ncol; scanLeadingEntry++)
        {
            entry = m.get(i, scanLeadingEntry);
            if(entry != 0)
            {
                scaler = entry;
                break;
            }
        }
        // divides all numbers in row by the leading entry
        for(let j = 0; j < (m.ncol); j++)
        {
            target = m.get(i, j);
            if(target == 0)
            {
                continue;
            }
            target = target / scaler;
            m.set(i, j, target);
        }
        if(t)
        {
            m = m.transpose();
        }
        // augmented matrix
        if(ma_ != null)
        {
            for(let j = 0; j < ma.ncol; j++)
            {
                target = ma.get(i, j);
                target = target / scaler;
                ma.set(i, j, target)
            }
            if(t)
            {
                ma = ma.transpose();
            }
        }
    }
    if(ma != null)
    {
        return [m, ma];
    }
    else
    {
        return m;
    }
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
    let target, ref, rowMultiplier;
    let impossible = false;
    // console.log(originalRank)

    while(keepGoing)
    {
        // goes row by row
        // console.log(row, col)
        ref = m.get(col, col); // the operation number on the diag
        let swapped = false;
        // checking if needs to swap rows
        if(ref == 0)
        {
            impossible = true;
            let newRow;
            for(let i = col; i < m.nrow; i++)
            {
                let candidate = m.get(i, col);
                if(candidate != 0)
                {
                    impossible = false;
                    ref = candidate;
                    newRow = i
                }
                else
                {
                    continue;
                }
            }
            if(impossible)
            {
                keepGoing = false;
            }
            else
            {
                m = swapRows(m, col, newRow);
                ma = swapRows(ma, col, newRow);
                swapped = true;
            }
        }
        target = m.get(row, col); // the number to be zeroed

        if (target != 0)
        {
            rowMultiplier = (target / ref);

            let targetRow = m.getRow(row);
            let aTargetRow = ma.getRow(row);
            let refRow = m.getRow(col);
            let aRefRow = ma.getRow(col);
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
        }
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

    if(impossible)
    {
        console.log("impossible")
    }
    return [m, ma];

}
function UREFConvert(m_, ma_)
{
    // rows and cols swapped so it preforms upper triangularization
    let m = copyMatrix(m_);
    let ma = copyMatrix(ma_);
    let keepGoing = true;
    let row = 0 // start at row 1
    let col = 1 // starts at second col
    let target, ref, rowMultiplier;
    let impossible = false;
    // console.log(originalRank)

    while(keepGoing)
    {
        // goes row by row
        // console.log(row, col)
        ref = m.get(col, col); // the operation number on the diag
        let swapped = false;
        // checking if needs to swap rows
        if(ref == 0)
        {
            impossible = true;
            let newRow;
            for(let i = col; i < m.ncol; i++)
            {
                let candidate = m.get(i, col);
                if(candidate != 0)
                {
                    impossible = false;
                    ref = candidate;
                    newRow = i
                }
                else
                {
                    continue;
                }
            }
            if(impossible)
            {
                keepGoing = false;
            }
            else
            {
                m = swapRows(m, col, newRow);
                ma = swapRows(ma, col, newRow);
                swapped = true;
            }
        }
        target = m.get(row, col); // the number to be zeroed
        if(target != 0)
        {
            rowMultiplier = (target / ref);

            let targetRow = m.getRow(row);
            let aTargetRow = ma.getRow(row);
            let refRow = m.getRow(col);
            let aRefRow = ma.getRow(col);
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
        }
    
        // progression and stopping 
        if((col + 1)  < m.ncol)
        {
            col = col + 1;
        }
        else
        {
            row = row + 1;
            col = row + 1;
        }

        if (row > (m.nrow - 2) && col > (m.ncol - 2))
        {
            // should stop when it reaches the last diagonal
            keepGoing = false;   
        }
    }
    if(impossible)
    {
        console.log("impossible")
        return null;
    }
    else
    {
        return [m, ma];
    }  
}
function RREFConvert(m_, ma_)
{
    // copying the matracies
    let m = copyMatrix(m_);
    let ma1 = copyMatrix(ma_);

    // getting into ref
    let REFs = REFConvert(m, ma1);
    m = REFs[0];
    ma1 = REFs[1];

    // scaling by first entry
    [m, ma1] = leadingEntryScale(m, ma1);

    // upper triangularizarion
    [m, ma1] = UREFConvert(m, ma1);

    m.FPFix();
    ma1.FPFix();

    return [m, ma1]
}

class Matrix
{
    constructor (nrow, ncol, data = null, xint = true)
    {   
        this.nrow = nrow;
        this.ncol = ncol;
        this.capacity = (ncol * nrow);
        this.m = [];
        this.xint = xint;
        
        // making null matrix
        if(data == null)
        {
            for(let i = 0; i < nrow; i++)
            {
                this.m[i] = [];
                for(let j = 0; j < ncol; j++)
                {
                    this.m[i][j] = 0;
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
        return  copy(this.m[row][col])
    }

    getRow(row)
    {
        return copyList(this.m[row])
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
        return copyList(data);
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
            let newM = new Matrix(this.nrow, m2.ncol, newData)
            if(this.xint){newM.toInt()}
            return newM;

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

    FPFix()
    {
        if (this.xint)
        {
            for(let r = 0; r < this.nrow; r++)
            {
                for(let c = 0; c < this.ncol; c++)
                {
                    let dp = Math.pow(10, 5);
                    this.m[r][c] = Math.round(this.m[r][c]*dp)/dp;
                }
            }
        }
    }
    toInt()
    {
        for(let r = 0; r < this.nrow; r++)
        {
            for(let c = 0; c < this.ncol; c++)
            {
                this.m[r][c] = Math.round(this.m[r][c]);
            }
        }
    }

    invert()
    {
        idm = identityMatrix(this.nrow);
        return RREFConvert(this, idm)[1];
    }
}
function copy(data)
{
    let x = data
    return x;
}

function copyMatrix(m)
{
    return new Matrix(m.nrow, m.ncol, m.getData());
}

function copyList(data)
{
    let newData = [];
    for(let i = 0; i < data.length; i++)
    {
        newData[i] = data[i];
    }
    return newData;
}

let m1 = new Matrix(2, 2, [0, -1, 1, 0]);
let m2 = new Matrix(2, 2, [4, 6, 1, 1]);
let m3 = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 8, 8, 9]);
let m4 = new Matrix(3, 1, [14, 32, 51]);
let unitM = new Matrix(3, 3, [1, 1, 1, 1, 1, 1, 1, 1, 1]);
let unitMa = new Matrix(3, 1, [1, 1, 1]);
let idm = identityMatrix(3)
let m8 = new Matrix(3, 3, [1, 2, -1, 2, 1, 2, -1, 2, 1])
let m9 = new Matrix(3, 1, [36, 35, 34])

m1.show();
m1.invert().show();
m1.invert().multiply(m1).show();


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

// let [m5, m6] = RREFConvert(m3, idm);

// m5.show();
// m6.show();



//m3.transpose().show()

// let augmentedMatrix = REFConvert(m3, m4)
// leadingEntryScale(augmentedMatrix[0], augmentedMatrix[1])


// m3.show();
// m4.show();

// console.log(m1)
// console.log(m2)

//console.log(m1.add(m2))