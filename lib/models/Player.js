var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function (db) {

        var Player,
            playerSchema = new Schema({
            steam_id: {type: String, required: true, index: true, unique: true},
            profile: {
                steam: {}
            },
            last_seen: Date,
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
            },
            // todo: introduce game rank schemas
            game_rank: {}
        });

    playerSchema.statics.findBySteamId = function (steamId) {

        if (!steamId)
            throw new Error("Missing steamId argument");

        return Player.findOne()
            .where('steam_id', steamId)
            .populate('game_stats.overall')
            .populate('game_stats.ad')
            .populate('game_stats.ca')
            .populate('game_stats.dom')
            .populate('game_stats.duel')
            .populate('game_stats.ffa')
            .populate('game_stats.race')
            .populate('game_stats.rr')
            .populate('game_stats.tdm')
            .exec();
    };

    playerSchema.statics.findBySteamIds = function (steamIds) {

        if (!steamIds)
            throw new Error("Missing steamIds argument");

        return Player.find()
            .where('steam_id')
            .in(steamIds)
            .exec();
    };

    playerSchema.statics.updateLastSeen = function (player) {
        var query = {
                steam_id: player.steam_id
            },
            update = {
                $set: {
                    last_seen: new Date()
                }
            };

        return Player.update(query, update).exec();
    };

    playerSchema.statics.findOrCreateBySteamId = function (steam_id) {

        var GameStats = db.model('GameStats');

        function createIfDontExist (player) {
            if (player) {
                return Promise.resolve(player);
            }

            var newPlayer = new Player({
                steam_id: steam_id,
                game_rank: {
                },
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
                    newPlayer.game_stats.overall.save().then(),
                    newPlayer.game_stats.ad.save().then(),
                    newPlayer.game_stats.ca.save().then(),
                    newPlayer.game_stats.dom.save().then(),
                    newPlayer.game_stats.duel.save().then(),
                    newPlayer.game_stats.ffa.save().then(),
                    newPlayer.game_stats.race.save().then(),
                    newPlayer.game_stats.rr.save().then(),
                    newPlayer.game_stats.tdm.save().then(),
                    newPlayer.save().then()
                ])
                .spread(function (overall, ad, ca, dom, duel, ffa, race, rr, tdm, player) {
                    return player;
                }, Promise.reject);

        }

        return new Promise(function (resolve, reject) {
            Player.findBySteamId(steam_id)
                .then(createIfDontExist)
                .then(resolve, reject);
        });
    };

    Player = db.model('Player', playerSchema);
    return Player;
};