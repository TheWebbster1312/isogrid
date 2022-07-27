var mouse = {
	x:undefined,
	y:undefined,
	i: undefined,
	j: undefined,
	k:undefined
}
//=======================================
window.addEventListener('mousemove',
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
		let mouseMatrix = toIJ(mouse.x-16, mouse.y-8, true);
		let [i, j] = mouseMatrix.getCol(0);
		mouse.i = i
		mouse.j = j
		mouseTile.updateCoords(i, j)
;})

// function findTile(x, y)
// {
//     for(element of tiles)
//     {
//         if(element.x)
//     }
// }