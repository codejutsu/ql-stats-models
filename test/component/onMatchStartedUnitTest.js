var Promise = require('bluebird'),
	expect = require('chai').expect,
	helper = require('../helper'),
	Player,
	MatchReport,
    GameStats,
	PlayerMatchStats;

describe('MATCH_STARTED - When match has started.', function () {


	// always assume that players exists
    // should be able to recover from a players not existing
	// create match report
	// create player match stats

    var matchReport,
        playerMatchStats;

	before(function (done) {
		function setDependencies (db) {
			Player = db.model('Player');
			MatchReport = db.model('MatchReport');
			GameStats = db.model('GameStats');
			PlayerMatchStats = db.model('PlayerMatchStats');
		}

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

        function setupScenario () {
			return Promise.all([
                createPlayer("76561198013158463"),
                createPlayer("76561198000636434"),
                createPlayer("76561198257190136")
            ])
		}

		helper.before()
			.then(setDependencies)
			.then(setupScenario)
            .then(function () {
			    done();
		    });
	});

	after(helper.after);

    // player's don't exist
    it('should be able to fail to create match report', function () {

    });


	it('should be able to create a match report', function (done) {

		MatchReport.createWithMatchStarted(helper.events.matchStarted).then(function (document) {
			expect(document._id).to.not.equal(null);
            expect(document.match_guid).to.equal('cb850666-d5e8-4310-b93b-1083fc26f658');
            matchReport = document;
			done();
		});

	});

    it('should be able to create player match stats', function (done) {
        PlayerMatchStats.createWithMatchStarted(helper.events.matchStarted).then(function (documents) {
            expect(documents.length).to.equal(2);
            expect(documents[0].match_guid).to.equal('cb850666-d5e8-4310-b93b-1083fc26f658');
            playerMatchStats = documents;
            done();
        });
    });


    it('should be able to update the match rapport with the created player match stats', function (done) {

        matchReport.updateWithPlayersMatchStats(playerMatchStats).then(function (document) {
            expect(document.player_match_stats.length).to.equal(2);
            expect(document.player_match_stats[0]).to.equal(playerMatchStats[0]._id);
            expect(document.player_match_stats[1]).to.equal(playerMatchStats[1]._id);
            done();
        })

    });

    it('should not add pre-existing player match stats references to match report', function (done) {
        matchReport.updateWithPlayersMatchStats(playerMatchStats).then(function (document) {
            expect(document.player_match_stats.length).to.equal(2);
            expect(document.player_match_stats[0]).to.equal(playerMatchStats[0]._id);
            done();
        });

    })

});

