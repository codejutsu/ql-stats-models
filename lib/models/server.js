var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var serverSchema = new Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
    network: { type: mongoose.Schema.Types.ObjectId, ref: 'ServerNetwork' },
    name: String,
    hostname: String,
    gameport: Number,
    rconport: Number,
    rcon_password: String,
    stats: Number,
    stats_password: String
});

module.exports = mongoose.model('Server', serverSchema);
