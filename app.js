/**
 * This app sets up a User Interface for sending MQTT signals to a grid of lights
 */
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

// local copy of grid
var floorGrid = [[], [], []];
var defaultGrid = [['r', 'r', 'r'], ['m', 'm', 'm'], ['c', 'c', 'c']]
var floorX = null;
var floorY = null;
var DEFAULT_GRID_NAME = 'floorish';

// re-route default page to /grid
app.get('/', function(req, res) {
    res.redirect('/grid');
});

// endpoint which renders the grid
// TODO automatically adjust floor dimensions
app.get('/grid', function(req, res) {
   
    var floorX = 3;
    var floorY = 3;

    var image = getImage();

    res.render('grid', {
	title: 'WELCOME TO TILE DRIVER',
	grid: floorGrid,
	x_dim: floorX,
	y_dim: floorY,
	getColor: getColor,
	image: image
    });
});

/**
 * processes incoming button presses
 * TODO convert to POST
 */
app.get('/press', function(req, res) {
    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
    var val = req.query.val;


    // figure out next tile value
    getNewTileVal(val, function(newVal) {

	console.log('changing (' + x + ',' + y + ') to ' + newVal);

	/**
	 * this is the code where you would be making an MQTT service call
	 */
	Tile.updateValue(
	    {
		x: x,
		y: y,
		grid: DEFAULT_GRID_NAME,
		value: newVal
	    }
	    // we pass a callback function to say what to do if the update fails or succeeds
	    , function(err, result) {
		if(err) {
		    console.log('change unsuccessful');
		    res.redirect('/grid');
		}
		else {
		    console.log('success!' + result);
		    // if successful, update local grid
		    floorGrid[req.query.y][req.query.x] = newVal;	
		    res.redirect('/grid');
		}
		
	    }
	);
    });
});


/**
 * get image location for display
 */
function getImage() {
    return '/images/Floorish_900.jpg'
}


/**
 * Load the current tile states (mine are simulated in mongodb)
 * But you could also ping the device to get tile states, as well as any other sensor info
 * or of course you could simply rely on the streamed image
 */
Device.findByName(DEFAULT_GRID_NAME, function(err, device) {
    // setting up default grid
    if(err) {
	floorX = 3;
	floorY = 3;
	floorGrid = defaultGrid;
	return;
    }
    else if (!device) {
	Device.createNew({name: DEFAULT_GRID_NAME, grid: {x:3, y:3}}, function(err, device) {
	    if(err) 
		return;
	    floorX = device.gridX;
	    floorY = device.gridY;
	});
    }
    else {			
	Tile.findByGrid(DEFAULT_GRID_NAME, function(err, tiles) {
	    tiles.forEach(function(tile) {
		//	if(tile.y + 1 > floorY)
		console.log('setting tile ' + tile.x + ',' + tile.y + ',' + ' to ' + tile.value);
		floorGrid[tile.y][tile.x] = tile.value;
	    });
	});
    }
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


// -----------------------------------------
// -------- COLOR DISPLAY SETTINGS ---------
// ------- TODO separate into module -------

var colors = {
    r: '#FF0000',
    g: '#00FF00',
    b: '#0000FF',
    y: '#FFFF00',
    m: '#FF00FF',
    c: '#00FFFF'
}

function getColor (val) {
    var color = colors[val];
    if(!color)
	color = '#FFFFFF';
    return color;
}

/** 
 * cycle through tile display values
 */
var colorCycle = ['r', 'g', 'b', 'y', 'm', 'c'];
function getNewTileVal(oldValue, callback) {
    var index = colorCycle.indexOf(oldValue);
    if(index == -1)
	callback('r');
    else
	callback(colorCycle[(index + 1) % 6]);
}
