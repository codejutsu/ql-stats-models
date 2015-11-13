var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var matchSchema = new Schema({

    player_stats: {type: mongoose.Schema.Types.ObjectId, ref: 'PlayerMatchStats'},

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

module.exports = mongoose.model('Match', matchSchema);
