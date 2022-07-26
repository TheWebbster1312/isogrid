var mouse = {
	x:undefined,
	y:undefined,
	i: undefined,
	j: undefined
}
//=======================================
window.addEventListener('mousemove',
	function(event){
		mouse.x = event.x;
		mouse.y = event.y;
		let mouseMatrix = toIJ(mouse.x, mouse.y, true);
		let [i, j] = mouseMatrix.getCol(0);
		mouseTile.updateCoords(i, j)
;})

// function findTile(x, y)
// {
//     for(element of tiles)
//     {
//         if(element.x)
//     }
// }