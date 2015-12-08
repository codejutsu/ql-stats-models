var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function (db) {

    var GlobalStats,
        globalStatsSchema = {
            game_stats: {
                overall: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                ad: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                ca: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                dom: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                duel: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                ffa: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                race: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                rr: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'},
                tdm: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats'}
            }
        };


    globalStatsSchema = new Schema(globalStatsSchema);

    globalStatsSchema.statics.get = function (type) {

        GlobalStats.findOne().where('game-stats.' + type)

    };

    globalStatsSchema.statics.findOrCreate = function () {
        var GameStats = db.model('GameStats');

        function createIfDontExist (globalStats) {
            if (globalStats) {
                return Promise.resolve(globalStats);
            }

            globalStats = new GlobalStats({
                game_stats: {
                    overall: new GameStats(),
                    ad: new GameStats(),
                    ca: new GameStats(),
                    dom: new GameStats(),
                    duel: new GameStats(),
                    ffa: new GameStats(),
                    race: new GameStats(),
                    rr: new GameStats(),
                    tdm: new GameStats()
                }
            });

            return Promise.all([
                    globalStats.game_stats.overall.save().then(),
                    globalStats.game_stats.ad.save().then(),
                    globalStats.game_stats.ca.save().then(),
                    globalStats.game_stats.dom.save().then(),
                    globalStats.game_stats.duel.save().then(),
                    globalStats.game_stats.ffa.save().then(),
                    globalStats.game_stats.race.save().then(),
                    globalStats.game_stats.rr.save().then(),
                    globalStats.game_stats.tdm.save().then(),
                    globalStats.save().then()
                ])
                .spread(function (overall, ad, ca, dom, duel, ffa, race, rr, tdm, globalStats) {
                    return globalStats;
                }, Promise.reject);
        }

        return new Promise(function (resolve, reject) {
            GlobalStats.findOne().exec()
                .then(createIfDontExist)
                .then(resolve, reject);
        });
    };

    GlobalStats = db.model('GlobalStats', globalStatsSchema);

    return GlobalStats;

};

