
var Device = require('../model/device').Device;

Device.findByName('floorish', function(err, result) {
    if(err) {
	console.log('Error: ' + JSON.stringify(err));
	return;
    }
    console.log(result);
});

Device.findAll(function(err, result) {
    console.log(result.size);
    console.log(result);
});
