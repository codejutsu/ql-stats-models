var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function (db) {
    var PlayerMatchStats,
        playerMatchStatsSchema = new Schema({
            game_rank: {
                before: {},
                after: {}
            },
            player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true},
            match: {type: mongoose.Schema.Types.ObjectId, ref: 'MatchReport', required: true},
            game_stats: {type: mongoose.Schema.Types.ObjectId, ref: 'GameStats', required: true},
            game_type: String,
            aborted: Boolean,
            match_guid: {type: String, required: true, index: true},
            steam_id: {type: String, required: true, index: true},
            nick: String,
            warmup: {type: Boolean, required: true },
            team: Number,
            // Rank
            rank: Number,
            team_rank: Number,
            tied_rank: Number,
            tied_team_rank: Number
        });


    playerMatchStatsSchema.statics.findByMatchGuid = function (guids) {
        return PlayerMatchStats.find()
            .where('match_guid')
            .in(guids)
            .populate('player match game_stats')
            .exec();
    };

    playerMatchStatsSchema.statics.findBySteamId = function (steamId) {
        return PlayerMatchStats.find()
            .where('steam_id', steamId)
            .exec();
    };


    playerMatchStatsSchema.statics.findBySteamIdAndMatchGuid = function (steam_id, match_guid) {
        return PlayerMatchStats.findOne()
            .where('steam_id', steam_id)
            .where('match_guid', match_guid)
            .exec()
    };


    playerMatchStatsSchema.statics.createWithPlayerStats = function (playerStats) {

        var steam_id = playerStats.DATA.STEAM_ID,
            match_guid = playerStats.DATA.MATCH_GUID,
            Player = db.model('Player'),
            GameStats = db.model('GameStats'),
            MatchReport = db.model('MatchReport');

        function createPlayerMatchStats (player, match, gameStats) {
            var playerMatchStats = new PlayerMatchStats({
                steam_id: steam_id,
                match_guid: match_guid,
                player: player,
                match: match,
                game_stats: gameStats,
                game_rank: {
                    before: {}
                },
                game_type: match.game_type,
                aborted: playerStats.DATA.ABORTED,
                nick: playerStats.DATA.NAME,
                warmup: playerStats.DATA.WARMUP,
                rank: playerStats.DATA.RANK,
                team_rank: playerStats.DATA.RANK,
                tied_rank: playerStats.DATA.TIED_RANK || 0,
                tied_team_rank: playerStats.DATA.TIAD_TEAM_RANK || 0
            });

            return playerMatchStats.save();
        }

        return Promise.all([
                Player.findBySteamId(steam_id),
                MatchReport.findByMatchGuid(match_guid),
                GameStats.createWithPlayerStats(playerStats)
            ])
            .spread(createPlayerMatchStats);

    };

    PlayerMatchStats = db.model('PlayerMatchStats', playerMatchStatsSchema);

    PlayerMatchStats.schema.path('warmup').validate(function (value) {
        return value === false;
    }, 'Warmup needs to be set to false.');

    return PlayerMatchStats;
};
