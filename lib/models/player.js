var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    Q = require('q'),
    playerStatsSchema = require('./playerStatsSchema');

var playerSchema = new Schema({
    steam_id: String,
    profile: {
        steam: {}
    },
    rank: {
      "global": {},
        "duel": {},
        "tdm": {},
        "ctf": {}
    },
    last_seen: Date,
    stats: playerStatsSchema
});

playerSchema.statics.findOrCreateUser = function (gameEventData) {

    var queryBySteamId = {
            'profile.steam.id': gameEventData.DATA.STEAM_ID
        },
        createUserQuery = {
            'profile.steam.id': gameEventData.DATA.STEAM_ID
        },
        createIfPlayerDontExist = function (player) {
            var deferred = Q.defer();
            if(player) {
                deferred.resolve(player);
            }

            player = new Player(createUserQuery);

            player.save(createUserQuery, function (err, player) {
                if(err) {
                    console.err(err.message);
                    deferred.reject(err);
                }
                deferred.resolve(player);
            });

            return deferred.promise;
        };

    return this.findOne(queryBySteamId)
				.then(createIfPlayerDontExist);
};


playerSchema.statics.updateLastSeen = function (gameEventData) {
	var deferred = Q.defer();
	var queryBySteamId = {
		'profile.steam.id': gameEventData.DATA.STEAM_ID
		},
		updateLastSeenBySteamId = {
			last_seen: new Date().toUTCString()
		};

	this.where(queryBySteamId)
        .update(updateLastSeenBySteamId, function (message) {
            if(message && message.ok !== 1) {
                deferred.reject(new Error('Update last seen failed.'))
            }

            deferred.resolve(null);
        });

	return deferred.promise;

};

playerSchema.statics.addMatch = function(steamid, matchid) {
    var deferred = Q.defer();
    this.where('profile.steam.id', steamid)
        .findOne()
        .exec()
        .then(function (player) {
            player.matches.push(matchid);
            player.save(function (document) {
                deferred.resolve(document);
            });
    });

    return deferred.promise;
};

playerSchema.statics.findBySteamIDs = function(steamIds) {
    return Player.find()
                    .where('steam_id')
                    .in(steamIds)
                    .exec();
};

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;
