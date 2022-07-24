var mouse = {
	x:undefined,
	y:undefined,
	i:undefined,
	j:undefined
}
//=======================================
window.addEventListener('mousemove',
	function(event){
		mouse.x = event.x - 16;
		mouse.y = event.y - 8;
		let mouseMatrix = toIJ(mouse.x, mouse.y, true);
		let [i, j] = mouseMatrix.getCol(0);
		mouse.i = i;
		mouse.j = j;
		mouseTile.updateCoords(i, j)
		animateFrame();
;})

// function findTile(x, y)
// {
//     for(element of tiles)
//     {
//         if(element.x)
//     }
// }