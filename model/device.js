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
