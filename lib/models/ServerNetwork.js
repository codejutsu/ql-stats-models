var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ServerNetwork,
	serverNetworkSchema = new Schema({
		owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
		collaborators: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
		name: String,
		description: String
	});

module.exports = ServerNetwork = mongoose.model('ServerNetwork', serverNetworkSchema);
