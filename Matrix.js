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

function guasianElimination(m1, m2)
{
    
}

function REFConvert(m, ma)
{
    // <add me>

    var keepGoing = true;
    var col = 0 // start at col 1
    var row = 1 // starts at second row
    var target, diagRef, rowMultiplier;
    var originalRank = m.getRank();
    console.log(originalRank)

    while(keepGoing)
    {
        console.log(row, col)
        target = m.get(row, col); // the number to be zeroed
        diagRef = m.get(col, col); // the operation number on the diag

        rowMultiplier = (target / diagRef);

        var targetRow = m.getRow(row);
        var refRow = m.getRow(col);

        // operate on target row
        for(var i = 0; i < m.ncol; i++)
        {
            m.set(row, i, (targetRow[i] - (rowMultiplier * refRow[i])));
        }

        // debugging
        console.log(target, diagRef, rowMultiplier)
        console.log(m.show())
    
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

    var newRank = m.getRank();

    if(newRank != originalRank)
    {
        console.log("Matrix Not invertable!")
        return null;
    }

    // leading entries to 1

    for(i = 0; i < m.nrow; i++)
    {
        var scaler = m.get(i, i);

        if(scaler == 0)
        {
            continue;
        }

        for(var j = 0; j < (m.nrow - i); j++)
        {
            target = m.get(i, i + j);
            target = target / scaler;
            m.set(i, i + j, target);
        }
    }

    // debugging
    m.show()
    m.transpose().show()

    // upper triangle
    row = m.nrow - 2
    keepGoing = true;

    while(keepGoing)
    {
        col = m.ncol -1;
        
        for(var i = 0; i < (m.nrow - row); i++)
        {
            scaler = m.get(row, col);

            
        }
    }
    
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
            for(var i = 0; i < nrow; i++)
            {
                this.m[i] = [];
                for(var j = 0; j < ncol; j++)
                {
                    this.m[i][j] = null;
                }
            }
        }
        //making non null matrix
        else
        {
            for(var i = 0; i < nrow; i++)
            {
                this.m[i] = [];
                for(var j = 0; j < ncol; j++)
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
    set(row, col, data)
    {
        this.m[row][col] = data
    }
    setRow(row, data)
    {
        // validation
        if(data.length != this.ncol)
        {
            return null;
        }
        
        if(row > this.nrow)
        {
            return null;
        }

        // setting row
        for(var i = 0; i < this.ncol; i++)
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
        
        if(col > this.nrow)
        {
            return null;
        }

        // setting col
        for(var i = 0; i < this.nrow; i++)
        {
            this.m[col][i] = data[i];
        }
    }

    sumRow(row)
    {
        // validatiom
        if(row > this.nrow)
        {
            return null;
        }

        return sum(this.getRow(row));
    }

    sumCol(col)
    {
        // validatiom
        if(col > this.ncol)
        {
            return null;
        }

        return sum(this.getCol(col));
    }

    sum()
    {
        var sum = 0;

        for(var i = 0; i< this.nrow; i++)
        {
            sum += this.sumRow(i);
        }

        return sum
    }
    
    transpose()
    {
        var newM = new Matrix(this.ncol, this.nrow);
        
        for(var i = 0; i < this.nrow; i++)
        {
            newM.setCol(i, this.getRow(i));
        }

        return newM;
    }

    multiply(m2)
    {
        if (typeof(m2) == "number" ){
            // for intager multiplication
            var newData = [];
            var r, c;
            for(var i = 0; i < this.capacity; i++)
            {
                r = Math.floor(i%this.nrow);
                c = Math.floor(i/this.ncol);
                newData[i] = this.m[r][c]*m2;
            }
            return new Matrix(this.nrow, this.ncol, newData);
        }
        else if(this.ncol == m2.nrow)
        {
            var newSize = this.nrow * m2.ncol;
            var newData = [];
            var r, c;
            for(var i = 0; i < newSize; i++)
            {
                r = Math.floor(i%this.nrow)
                c = Math.floor(i/m2.nrow)
                var row1 = this.getRow(r);
                var col2 = m2.getCol(c);
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
            var newData = [];
            var i = 0;
            for(var c = 0; c < this.ncol; c++)
            {
                for(var r = 0; r < this.ncol; r++)
                {
                    newData[i] = this.m[r][c] + m2.m[r][c];
                    i++;
                }
            }
            return new Matrix(this.nrow, this.ncol, newData);
        }
        else{
            return null;
        }
    }

    getRank()
    {
        var rank = 0;
        for(var i = 0; i < this.nrow; i++)
        {
            if(sum(this.getRow(i)) != 0) rank += 1;
        }

        return rank;
    }

}

m1 = new Matrix(2, 2, [0, -1, 1, 0]);
m2 = new Matrix(2, 2, [4, 6, 1, 1]);
m3 = new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 8, 8, 9]);

//m3.transpose().show()

REFConvert(m3);

// console.log(m1)
// console.log(m2)

//console.log(m1.add(m2))