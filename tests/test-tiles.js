var Tile = require('../model/tile').Tile;

Tile.updateValue({x: 0, y: 0, grid: 'floorish', value: 'zzz'}, function(err, res) {
    if(err) {
	console.log('error: ' + JSON.stringify(error));
	return;
    }
    console.log(res);
});

function initialInsert() {

    var grid = [['r', 'g', 'g'], ['r', 'r', 'g'], ['b', 'b', 'g']]

    for (var y=0; y<grid.length; y++) {
	for (var x=0; x<grid.length; x++) {
	    Tile.insert({
		grid: 'floorish',
		x: x,
		y: y,
		value: grid[y][x]
	    }, function(err, result) {
		if(err) {
		    console.log('error: ' + JSON.stringify(err));
		    return;
		}
		console.log(result);
	    });
	}
    }
}
