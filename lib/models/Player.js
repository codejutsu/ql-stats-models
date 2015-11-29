var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function (db) {

    var Player,
        GameStats = db.model('GameStats'),
        MatchReport = db.model('MatchReport'),
        playerSchema = new Schema({
            steam_id: {type: String, required: true},
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


    playerSchema.statics.updateLastSeen = function (gameEventData) {

        var updateLastSeen = {
            $set: {
                last_seen: new Date().toUTCString()
            }
        };

        return this.where('steam_id', gameEventData.DATA.STEAM_ID)
            .update(updateLastSeen)
            .exec();
    };

    playerSchema.statics.addMatch = function (steamid, matchid) {
        return this.where('steam_id', steamid)
            .findOne()
            .exec()
            .then(function (player) {
                player.matches.push(matchid);
                return player.save();
            });

    };

    playerSchema.statics.findBySteamId = function (steamId) {
        if (!steamId)
            throw new Error("Missing steamId argument");
        return Player.findOne()
            .where('steam_id', steamId)
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

    // TODO: move to GameStats
    playerSchema.methods.updateStatsWith = function (playerMatchStats) {
        var updateQuery = {
            $inc: {
                'game_stats.overall':  playerMatchStats.game_stats.toObject()
            }
        };
        //return Player.update(this, updateQuery).exec();
    };

    playerSchema.statics.findOrCreateUser = function (gameEventData) {

        var createIfPlayerDontExist = function (player) {
            if (player) {
                return Promise.resolve(player);
            }

            return new Player({
                steam_id: gameEventData.DATA.STEAM_ID
            })
                .save();

        };

        return this.where('steam_id', gameEventData.DATA.STEAM_ID)
            .findOne()
            .exec()
            .then(createIfPlayerDontExist)
    };

    Player = db.model('Player', playerSchema);
    return Player;
};