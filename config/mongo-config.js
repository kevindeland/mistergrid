/**
 * Configure mongo connection here.
 */
var url = null;

if(process.env.VCAP_SERVICES) {
	console.log('getting mongodb url from env var');
	var env = JSON.parse(process.env.VCAP_SERVICES);
	url = env['mongodb-2.2'][0].credentials.url;
	console.log(exports.url);
}
else {
	url = 'mongodb://localhost/mistergrid';
}

module.exports = {
		url: url,
		db: require('monk')(url)
}

