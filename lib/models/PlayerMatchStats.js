var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function (db) {
    var PlayerMatchStats,
        MatchReport = db.model('MatchReport'),
        Player = db.model('Player'),
        GameStats = db.model('GameStats'),

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
            match_guid: {type: String, required: true, index: true, unique: true},
            steam_id: {type: String, required: true, index: true},
            nick: String,
            warmup: Number,
            team: Number,
            // Rank
            rank: Number,
            team_rank: Number,
            tied_rank: Number,
            tied_team_rank: Number
        });

    playerMatchStatsSchema.statics.findByGuid = function (guids) {
        return PlayerMatchStats.find()
            .where('match_guid')
            .in(guids)
            .exec();
    };


    playerMatchStatsSchema.statics.findBySteamIdAndMatchGuid = function (steam_id, match_guid) {
        return PlayerMatchStats.findOne()
            .where('steam_id', steam_id)
            .where('match_guid', match_guid)
            .exec()
    };


    function getPlayerAndMatchReport (steam_id, match_guid) {
        return Promise.all([
            Player.findBySteamId(steam_id).then(),
            MatchReport.findByGuid(match_guid).then()
        ]);
    }


    // findOne
    //createIfEmpty
    //createGameStats
    //save
    //return
    playerMatchStatsSchema.statics.findOrCreateWithPlayerStats = function (playerStatsEventData) {

        var steam_id = playerStatsEventData.DATA.STEAM_ID,
            match_guid = playerStatsEventData.DATA.MATCH_GUID;

        return Promise.all([
            PlayerMatchStats.findBySteamIdAndMatchGuid().then(),
            createIfEmpty().then()
        ]).then(function (results) {
            return results[1];
        });

        function createPlayerMatchStats (results) {

            var gameStats = results[0],
                player = results[1][0],
                match = results[1][1];

            return new PlayerMatchStats({
                steam_id: steam_id,
                match_guid: match_guid,
                player: player,
                match: match,
                game_stats: gameStats,
                game_rank: {
                    before: player.game_rank
                },
                game_type: match.game_type,
                aborted: playerStatsEventData.DATA.ABORTED,
                nick: playerStatsEventData.DATA.NAME,
                warmup: playerStatsEventData.DATA.WARMUP,
                //team: Number,
                rank: playerStatsEventData.DATA.RANK,
                team_rank: playerStatsEventData.DATA.RANK,
                tied_rank: playerStatsEventData.DATA.TIED_RANK || 0,
                tied_team_rank: playerStatsEventData.DATA.TIAD_TEAM_RANK || 0
            }).save();
        }


        function createIfEmpty (playerMatchStats) {
            if (playerMatchStats) {
                return new Promise(function (resolve, reject) {
                    resolve(playerMatchStats);
                });
            }

            return Promise.all([
                GameStats.createWithMatchStarted(playerStatsEventData).then(),
                getPlayerAndMatchReport(steam_id, match_guid).then()
            ]).then(createPlayerMatchStats);

        }
    };

    playerMatchStatsSchema.methods.updateWithPlayerStats = function (playerStatsEventData) {
        var updateQuery = {
            game_type: playerStatsEventData.DATA.GAME_TYPE,
            aborted: playerStatsEventData.DATA.ABORTED,
            nick: playerStatsEventData.DATA.NICK,
            warmup: playerStatsEventData.DATA.WARMUP,
            team: playerStatsEventData.DATA.TEAM,
            // Rank
            rank: playerStatsEventData.DATA.RANK,
            team_rank: playerStatsEventData.DATA.TEAM_RANK,
            tied_rank: playerStatsEventData.DATA.GAME_TYPE.TIED_RANK,
            tied_team_rank: playerStatsEventData.DATA.TIED_TEAM_RANK
        };
        return this.update(updateQuery).exec();
    };

    playerMatchStatsSchema.statics.updateWithPlayerStats = function (playerStatsEventData) {

        function updateWithPlayerStatsData (playerMatchStats) {
            return playerMatchStats.updateWithPlayerStats(playerStatsEventData);
        }

        return PlayerMatchStats.findOrCreateWithPlayerStats(playerStatsEventData)
            .then(updateWithPlayerStatsData);

    };

    // remove logic to create match
    playerMatchStatsSchema.statics.createWithMatchStarted = function (matchStartedEventData) {

        var filterSpectators = function (i) {
                return i.TEAM !== 3
            },
            mapSteamId = function (p) {
                return p.STEAM_ID;
            },
            Player = db.model('Player'),
            MatchReport = db.model('MatchReport'),
            GameStats = db.model('GameStats'),
            steamIds = matchStartedEventData.DATA.PLAYERS.filter(filterSpectators).map(mapSteamId),
            match,
            players;

        function getMatchReportAndPlayers () {
            return Promise.all([
                MatchReport.findByGuid(matchStartedEventData.DATA.MATCH_GUID).then(),
                Player.findBySteamIds(steamIds).then()
            ])
        }

        function createPlayerMatchStats (results) {
            return Promise.all(results.map(function (result) {
                var gameStats = result[0],
                    player = result[1];
                return new PlayerMatchStats({
                    player: player._id,
                    match: match._id,
                    game_stats: gameStats,
                    match_guid: matchStartedEventData.DATA.MATCH_GUID,
                    steam_id: player.steam_id
                }).save()
            }));
        }

        function createPlayerGameStats (results) {
            var createGameStatsPerPlayer = [];
            match = results[0];
            players = results[1];

            players.forEach(function (player) {
                createGameStatsPerPlayer.push(new Promise(function (resolve, reject) {
                    new GameStats().save().then(function (gameStats) {
                        resolve([gameStats, player]);
                    });
                }));
            });

            return Promise.all(createGameStatsPerPlayer);
        }

        return getMatchReportAndPlayers()
            .then(createPlayerGameStats)
            .then(createPlayerMatchStats)
    };

    PlayerMatchStats = db.model('PlayerMatchStats', playerMatchStatsSchema);
    return PlayerMatchStats;
};
