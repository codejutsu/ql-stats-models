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
            match_guid: {type: String, required: true, index: true, unique : true},
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

    matchReportSchema.statics.findByGuid = function (match_guid) {
        return MatchReport.findOne()
            .where('match_guid', match_guid)
            .exec();
    };

    matchReportSchema.statics.createWithMatchStarted = function (matchStarted) {

        var PlayerMatchStats = db.model('PlayerMatchStats');

        function createMatchReport() {
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

    matchReportSchema.statics.updateWith = function (matchReportEvent) {
        function updateMatchReport(matchReport) {

            if(!matchReport) {
                throw new Error('MatchReport with GUID: ', matchReportEvent.DATA.MATCH_GUID, 'does not exist');
            }

            var update = {
                aborted: matchReportEvent.DATA.ABORTED,
                exit_msg: matchReportEvent.DATA.EXIT_MSG,
                game_length: matchReportEvent.DATA.GAME_LENGTH,
                last_lead_change_time: matchReportEvent.DATA.LAST_LEAD_CHANGE_TIME,
                last_scorer: matchReportEvent.DATA.LAST_SCORER,
                last_team_scorer: matchReportEvent.DATA.LAST_TEAMSCORER,
                restarted: matchReportEvent.DATA.RESTARTED,
                tscore0: matchReportEvent.DATA.TSCORE0,
                tscore1: matchReportEvent.DATA.TSCORE1
            };

            return matchReport.update(update).exec();

        }


        return new Promise(function (resolve, reject) {
            return MatchReport.findByGuid(matchReportEvent.DATA.MATCH_GUID)
                .then(updateMatchReport)
                .then(resolve, reject)
        });
    };

    matchReportSchema.methods.updateWithPlayersMatchStats = function (playerMatchStats) {
        var self = this;

        playerMatchStats.forEach(function(p) {

            if(!_.findWhere(self.player_match_stats, p._id)) {
                self.player_match_stats.push(p);
            }

        });

        return this.save();
    };


    matchReportSchema.pre('save', function (next) {
        this.game_type = this.game_type.toLowerCase();
        next();
    });

    MatchReport = db.model('MatchReport', matchReportSchema);
    return MatchReport;
};
