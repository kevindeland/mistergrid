var tiles = require('../config/mongo-config').db.get('tiles');

var tileSchema = {
    grid: String,
    x: Number,
    y: Number,
    value: String
}

var Tile = {
    insert: function(tile, callback) {
	console.log('inserting tile ' + JSON.stringify(tile));
	tiles.insert(tile, function(err, result) {
	    if(err) {
		callback(err);
	    } else {
		callback(null, result);
	    }
	});
    },
    findByGrid: function(name, callback) {
	console.log('finding all in grid ' + name);
	tiles.find({grid: name}, function(err, tiles) {
	    if(err) {
		callback(err);
	    } else {
		callback(null, tiles)
	    }
	});
    },
    updateValue: function(tile, callback) {
	console.log('updating tile ' + JSON.stringify(tile));
	tiles.update(
	    {grid: tile.grid, x: tile.x, y: tile.y}, 
	    {$set: {value: tile.value}}, 
	    function(err, result) {
		if(err) {
		    callback(err);
		} else {
		    console.log('update result ' + result);
		    callback(null, result);
		}
	    }
	);
    }
}

module.exports = {
    Tile: Tile
}
