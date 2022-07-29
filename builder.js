var mouse = {
	x: undefined,
	y: undefined,
	i: undefined,
	j: undefined,
	k: undefined
}
//=======================================
window.addEventListener('mousemove',
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
		let mouseMatrix = toIJ(mouse.x-16, mouse.y-8, true);
		let [i, j] = mouseMatrix.getCol(0);

		topBlock = blockSpace.getTop(i, j);
		let k;
		if(topBlock != null)
		{
			k = topBlock.k;
		}
		else
		{
			k = 0;
		}
		mouse.i = i;
		mouse.j = j;
		mouse.k = k;
		mouseTile.updateCoords(i, j, k)
;})

// function findTile(x, y)
// {
//     for(element of tiles)
//     {
//         if(element.x)
//     }
// }