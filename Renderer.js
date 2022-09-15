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
let spaces = [blockSpace]


function animateFrame()
{
    requestAnimationFrame(animateFrame);
    clearScreen();
    for(let space of spaces)
    {
        space.draw();
    }
}

function draw_space(space)
{

}

function clearScreen()
{
    c.clearRect(0,0,canvas.width, canvas.height);
}
animateFrame();