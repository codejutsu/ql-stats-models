var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var serverSchema = new Schema({
    owner_steam_id: String,
    network: String,
    name: String,
    hostname: String,
    gameport: Number,
    rconport: Number,
    rcon_password: String,
    stats: Number,
    stats_password: String
});

module.exports = mongoose.model('Server', serverSchema);
