var Promise = require('bluebird');

module.exports = function (db) {

    var Player = db.model('Player'),
        GameStats = db.model('GameStats');

    function createPlayer (steam_id) {
        var player = new Player({
            steam_id: steam_id,
            game_rank: {
                duel: 1200
            },
            game_stats: {
                overall: new GameStats({
                    win: 1337,
                    kills: 16
                }),
                duel: new GameStats({
                    win: 15
                })
            }
        });

        return Promise.all([
            player.save().then(),
            player.game_stats.duel.save().then(),
            player.game_stats.overall.save().then()
        ]);
    }

    return {
        createPlayer: createPlayer
    }
};