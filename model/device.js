var devices = require('../config/mongo-config').db.get('devices');


// only here for reference
var deviceSchema = {
    name: String,
    id: String,
    credentials: {
	url: String
    },
    gridX: Number,
    gridY: Number
};


var Device = {
    createNew: function(name, grid, callback) {
	console.log('creating a new grid w/ name' + name);
	devices.update({name: name, gridX: grid.x, gridY: grid.y}, function(err, device) {
	    if(err) {
		callback(err);
	    } else {
		callback(null, device)
		console.log('created device ' + JSON.stringiy(device));
	    }
	});
    },
    findByName: function(name, callback) {
	console.log('finding grid w/ name ' + name);
	devices.findOne({name: name}, function(err, device) {
	    
	    console.log(device);
	    if(err) {
		callback(err);
	    } else {
		callback(null, device);
	    }
	});
    },
    findAll: function(callback) {
	devices.find(function(err, devices) {
	    if(err) {
		callback(err);
	    } else {
		callback(null, devices);
	    }
	});
    }
};

module.exports = {
    Device: Device
};
