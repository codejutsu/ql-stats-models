var Q = require('q');

module.exports = {
	register: function (connection) {
		return Q.try(function () {
			require('./lib/models')(connection);
			return connection;
		});
	}
};