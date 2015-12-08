var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    Player,
    steamIds = ['76561198013158463', '76561198000636434'];

describe('When using the player model.', function () {

    beforeEach(function (done) {
        function setDependencies (db) {
            Player = db.model('Player');
        }

        function setupScenario () {
            return Promise.all([])
        }

        helper.before()
            .then(setDependencies)
            .then(setupScenario)
            .then(function () {
                done();
            });
    });


    afterEach(helper.after);


    it('should be able to find or create by steam id', function (done) {

        function evaluate (player) {
            expect(player.steam_id).to.equal(steamIds[0])
        }

        Player.findOrCreateBySteamId(steamIds[0]).then(evaluate).then(done);

    });


    it('should be able to find player by steam id', function (done) {
        Player.findOrCreateBySteamId(steamIds[0]).then(function () {
            Player.findBySteamId(steamIds[0]).then(function (player) {
                expect(player).not.to.equal(null);
                expect(player._id).not.to.equal(null);
            });
        }).then(done);
    });

    it('should be able to find players by steam ids', function (done) {
        Promise.all([
                Player.findOrCreateBySteamId(steamIds[0]),
                Player.findOrCreateBySteamId(steamIds[1])
            ])
            .spread(function (p1, p2) {
                return Player.findBySteamIds([p1.steam_id, p2.steam_id]).then()
            })
            .then(function (players) {
                expect(players.length).to.equal(2);
            })
            .then(done);
    });

});

