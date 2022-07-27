var mouse = {
	x:undefined,
	y:undefined,
<<<<<<< HEAD
	i: undefined,
	j: undefined,
	k:undefined
=======
	i:undefined,
	j:undefined
>>>>>>> origin/master
}
//=======================================
window.addEventListener('mousemove',
	function(event){
<<<<<<< HEAD
		mouse.x = event.x;
		mouse.y = event.y;
		let mouseMatrix = toIJ(mouse.x-16, mouse.y-8, true);
		let [i, j] = mouseMatrix.getCol(0);
		mouse.i = i
		mouse.j = j
=======
		mouse.x = event.x - 16;
		mouse.y = event.y - 8;
		let mouseMatrix = toIJ(mouse.x, mouse.y, true);
		let [i, j] = mouseMatrix.getCol(0);
		mouse.i = i;
		mouse.j = j;
>>>>>>> origin/master
		mouseTile.updateCoords(i, j)
;})

// function findTile(x, y)
// {
//     for(element of tiles)
//     {
//         if(element.x)
//     }
// }