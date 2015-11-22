var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    game_stats = require('../game/stats'),
    playerStatsSchema = require('./playerStatsSchema');


var matchReportSchema = new Schema({

    // match started
    capture_limit: Number,
    factory: String,
    factory_title : String,
    fraglimit: Number,
    game_type: String,
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
    owner_steamid: String,

    // match completed
    aborted: Boolean,
    exit_msg: String,
    game_length: Number,
    last_lead_change_time: Number,
    last_scorer: String,
    last_team_scorer: String,
    restarted: Number,
    tscore0: Number,
    tscore1: Number,


    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
    player_game_stats: [game_stats]

});

matchReportSchema.statics.createFrom = function(event) {
    var matchReport = new MatchReport({
        capture_limit: event.DATA.CAPTURE_LIMIT,
        factory: event.DATA.FACTORY,
        factory_title: event.DATA.FACTORY_TITLE,
        fraglimit: event.DATA.FRAG_LIMIT,
        game_type: event.DATA.GAME_TYPE,
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
        owner_steamid: (event.SERVER && event.SERVER.OWNER_STEAM_ID) || '',

        player_stats: [playerStatsSchema]

    });

    return matchReport.save();

};

matchReportSchema.statics.findByGuid = function (guid) {
    return MatchReport.findOne()
                .where('guid', guid)
                .exec();
};

matchReportSchema.pre('save', function (next) {
    this.game_type = this.game_type.toLowerCase();
    next();
});

var MatchReport = mongoose.model('MatchReport', matchReportSchema);
module.exports = MatchReport;
