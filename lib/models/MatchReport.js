var Promise = require('bluebird'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function (db) {
    var MatchReport,
        matchReportSchema = new Schema({

            // references
            player_match_stats: [{type: mongoose.Schema.Types.ObjectId, ref: 'PlayerMatchStats'}],

            // match started
            capture_limit: Number,
            factory: String,
            factory_title: String,
            fraglimit: Number,
            game_type: {type: String},
            infected: Number,
            instagib: Number,
            map: String,
            match_guid: {type: String, required: true, index: true},
            mercy_limit: Number,
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
            tscore1: Number

        });

    matchReportSchema.statics.findByMatchGuid = function (match_guid) {
        var GameStats = db.model('GameStats');
        return new Promise(function (resolve, reject) {
            MatchReport.findOne()
                .where('match_guid', match_guid)
                .populate('player_match_stats')
                .exec().then(resolve, reject)
        });
    };

    matchReportSchema.statics.createWithMatchStarted = function (matchStarted) {

        function createMatchReport () {
            return new MatchReport({
                capture_limit: matchStarted.DATA.CAPTURE_LIMIT,
                factory: matchStarted.DATA.FACTORY,
                factory_title: matchStarted.DATA.FACTORY_TITLE,
                fraglimit: matchStarted.DATA.FRAG_LIMIT,
                game_type: matchStarted.DATA.GAME_TYPE,
                infected: matchStarted.DATA.INFECTED,
                instagib: matchStarted.DATA.INSTAGIB,
                map: matchStarted.DATA.MAP,
                match_guid: matchStarted.DATA.MATCH_GUID,
                mercy_limit: matchStarted.DATA.MERCY_LIMIT,
                quadhog: matchStarted.DATA.QUADHOG,
                score_limit: matchStarted.DATA.SCORE_LIMIT,
                server_title: matchStarted.DATA.SERVER_TITLE,
                timelimit: matchStarted.DATA.TIME_LIMIT,
                training: matchStarted.DATA.TRAINING,
                owner_steamid: (matchStarted.SERVER && matchStarted.SERVER.OWNER_STEAM_ID) || ''
            }).save();
        }

        return createMatchReport()
    };

    matchReportSchema.statics.updateWithMatchReport = function (matchReport) {

        var match_guid = matchReport.DATA.MATCH_GUID,
            PlayerMatchStats = db.model('PlayerMatchStats');

        function updateMatchReport (playerMatchStats) {

            var query = {
                    match_guid: match_guid
                },
                update = {
                    aborted: matchReport.DATA.ABORTED,
                    exit_msg: matchReport.DATA.EXIT_MSG,
                    game_length: matchReport.DATA.GAME_LENGTH,
                    last_lead_change_time: matchReport.DATA.LAST_LEAD_CHANGE_TIME,
                    last_scorer: matchReport.DATA.LAST_SCORER,
                    last_team_scorer: matchReport.DATA.LAST_TEAMSCORER,
                    restarted: matchReport.DATA.RESTARTED,
                    tscore0: matchReport.DATA.TSCORE0,
                    tscore1: matchReport.DATA.TSCORE1,
                    player_match_stats: playerMatchStats
                };

            return MatchReport.update(query, update)
                .exec();

        }

        return PlayerMatchStats.findByMatchGuid(match_guid)
            .then(updateMatchReport);
    };

    matchReportSchema.statics.updateGameStats = function (match_guid) {

        var GlobalStats = db.model('GlobalStats'),
            PlayerMatchStats = db.model('PlayerMatchStats'),
            GameStats = db.model('GameStats');

        return Promise.all([
            MatchReport.findByMatchGuid(match_guid),
            GlobalStats.findOrCreate(),
            PlayerMatchStats.findByMatchGuid(match_guid)
        ]).spread(function (matchReport, globalStats, playerMatchStats) {

            var globalIds = [globalStats.game_stats.overall._id, globalStats.game_stats[matchReport.game_type]._id],
                promises = [];

            playerMatchStats.forEach(function (p) {
                var promise = new Promise(function (resolve, reject) {
                    var source = p.game_stats,
                        targets = [];
                    targets = targets.concat(globalIds);
                    targets = targets.concat([p.player.game_stats.overall, p.player.game_stats[matchReport.game_type]]);

                    GameStats.updateWithGameStats(source, targets)
                        .then(resolve, reject);

                });

                promises.push(promise);

            });
            return Promise.all(promises);
        })

    };

    matchReportSchema.pre('save', function (next) {
        this.game_type = this.game_type.toLowerCase();
        next();
    });


    //matchReportSchema.post('update', function (doc) {
    //    console.log(doc);
    //});


    MatchReport = db.model('MatchReport', matchReportSchema);
    return MatchReport;
};
