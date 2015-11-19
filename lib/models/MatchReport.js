var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    gamestats = require('../gamestats'),
    playerStatsSchema = require('./playerStatsSchema');


var matchReportSchema = new Schema({

    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],

    capture_limit: Number,
    factory: String,
    factory_title : String,
    fraglimit: Number,
    gametype: String,
    infected: Number,
    instagib: Number,
    map: String,
    guid: String,
    mercy_limit:Number,
    quadhog: Number,
    score_limit: Number,
    server_title: String,
    timelimit: Number,
    training: Number,

    aborted: Boolean,
    exit_msg: String,
    game_length: Number,
    last_lead_change_time: Number,
    last_scorer: String,
    last_team_scorer: String,
    restarted: Number,
    tscore0: Number,
    tscore1: Number,

    owner_steamid: String,

    gamestats: [gamestats]
});

matchReportSchema.statics.createFrom = function(event) {
    var matchReport = new MatchReport({
        player_stats: [playerStatsSchema],
        capture_limit: event.DATA.CAPTURE_LIMIT,
        factory: event.DATA.FACTORY,
        factory_title: event.DATA.FACTORY_TITLE,
        fraglimit: event.DATA.FRAG_LIMIT,
        gametype: event.DATA.GAME_TYPE,
        infected: event.DATA.INFECTED,
        instagib: event.DATA.INSTAGIB,
        map: event.DATA.MAP,
        guid: event.DATA.MATCH_GUID,
        mercy_limit: event.DATA.MERCY_LIMIT,
        quadhog: event.DATA.QUADHOG,
        score_limit: event.DATA.SCORE_LIMIT,
        server_title: event.DATA.SERVER_TITLE,
        timelimit: event.DATA.TIME_LIMIT,
        training: event.DATA.TRAINING,
        owner_steamid: (event.SERVER && event.SERVER.OWNER_STEAM_ID) || ''
    });

    return matchReport.save();

};


matchReportSchema.statics.findByGuid = function (guid) {
    return MatchReport.findOne()
                .where('guid', guid)
                .exec();
};
var MatchReport = mongoose.model('Match', matchReportSchema);
module.exports = MatchReport;
