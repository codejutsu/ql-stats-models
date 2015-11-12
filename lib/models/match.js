var mongoose = require('mongoose'),
    Player = require('./Player'),
    Schema = mongoose.Schema;

var matchSchema = new Schema({
    guid: String,
    owner_id: String,
    server_title: String,
    exit_msg: String,
    map_id: Number,
    gametype: String,
    factory: String,
    factory_title : String,
    aborted: Boolean,
    game_length: Number,
    capture_limit: Number,
    mercy_limit:Number,
    quadhog: Number,
    infected: Number,
    instagib: Number,
    tscore0: Number,
    tscore1: Number,
    score_limit: Number,
    last_lead_change_time: Number
});

