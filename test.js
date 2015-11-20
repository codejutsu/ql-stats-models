var Q = require('q');

function a(cb) {
	cb('test');
}

a(function(value) {
	console.log(value);
});

