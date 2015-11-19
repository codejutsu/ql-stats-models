var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var serverNetworkSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
    collaborators: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
    name: String,
    description: String
});

module.exports = mongoose.model('ServerNetwork', serverNetworkSchema);
