

var express = require('express')
,   http = require('http')
,   Tile = require('./model/tile').Tile
,   Device = require('./model/device').Device
;

var app = express();

app.set('port', process.env.PORT || 3000);

// middleware to set where we get our front-end views, and how we're rendering them (embedded javascript)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// to display images, you have to specify a directory to be made available for public access
app.use(express.static(__dirname + '/public'));

app.use(app.router);

var colors = {
    r: '#FF0000',
    g: '#00FF00',
    b: '#0000FF',
    y: '#FFFF00',
    m: '#FF00FF',
    c: '#00FFFF'
}

var floorGrid = [[], [], []];
var defaultGrid = [['r', 'r', 'r'], ['m', 'm', 'm'], ['c', 'c', 'c']]
var floorX = null;
var floorY = null;

/**
 * Load the current tile states (mine are simulated in mongodb)
 * But you could also ping the device to get tile states, as well as any other sensor info
 * or of course you could simply rely on the streamed image
 */
Device.findByName('floorish', function(err, device) {
    if(err || !device) {
	floorX = 3;
	floorY = 3;
	floorGrid = defaultGrid;
	return;
    }
    floorX = device.gridX;
    floorY = device.gridY;
    Tile.findByGrid('floorish', function(err, tiles) {
	tiles.forEach(function(tile) {
	    //	if(tile.y + 1 > floorY)
	    console.log('setting tile ' + tile.x + ',' + tile.y + ',' + ' to ' + tile.value);
	    floorGrid[tile.y][tile.x] = tile.value;
	});
    });
});

// re-route default page to /grid
app.get('/', function(req, res) {
    res.redirect('/grid');
});

app.get('/grid', function(req, res) {
   
    var floorX = 3;
    var floorY = 3;

    var image = getImage();

    res.render('grid', {
	title: 'WELCOME TO TILE DRIVER',
	grid: floorGrid,
	x_dim: floorX,
	y_dim: floorY,
	colors: colors,
	image: image
    });
});

app.get('/press', function(req, res) {
    console.log(req.query);

    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
    var val = req.query.val;
    console.log('changing (' + x + ',' + y + ') to ' + val);
    var update = {
	x: x,
	y: y,
	grid: 'floorish'
    };


    getNewTileVal(val, function(newVal) {

	update.value = newVal;

	console.log('changing tile to ' + newVal);

	Tile.updateValue(
	    update
	    , function(err, result) {
	    if(err)
		console.log('change unsuccessful');
	    console.log('success!' + result);
	    floorGrid[req.query.y][req.query.x] = newVal;	
	    res.redirect('/grid');
	    
	});
    });
});

function getNewTileVal(oldValue, callback) {
    console.log(oldValue);
    switch(oldValue) {
    case 'r': 
	callback('g');
	break;
    case 'g':
	callback('b');
	break;
    case 'b': 
	callback('y');
	break;
    case 'y':
	callback('m');
	break;
    case 'm':
	callback('c');
	break;
    case 'c':
	callback('r');
	break;
    }
}


function getImage() {
    return '/images/john_cohn.jpg'
}

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});