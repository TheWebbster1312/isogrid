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
    clearScreen();
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

function draw_space(space)
{

}

function clearScreen()
{
    c.clearRect(0,0,canvas.width, canvas.height);
}