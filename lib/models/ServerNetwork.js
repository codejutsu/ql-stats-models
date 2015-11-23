var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = function (connection) {
	var ServerNetwork,
		serverNetworkSchema = new Schema({
			owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
			collaborators: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
			name: String,
			description: String
		});

	ServerNetwork = connection.model('ServerNetwork', serverNetworkSchema);
	return ServerNetwork;
};