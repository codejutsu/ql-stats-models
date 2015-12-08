var Promise = require('bluebird'),
	mongoose = require('mongoose'),
	storage = require('../../index'),
	config = require('./config.json');

var helper = (function () {
	var _db,
		log = {info: function() {}}//console;



	function connect () {
		return new Promise(function (resolve, reject) {
			_db = mongoose.createConnection(config.mongodb, function () {
				log.info('Connected to:', config.mongodb);
				resolve(_db);
			});
		});
	}
	function register(db) {
		return new Promise(function (resolve, reject) {
			storage.register(db).then(resolve);
			log.info('Registered models:', Object.keys(_db.models).join(' '));
		})
	}
	function close () {
		var clearCollectionPromises = [];
		log.info('Clearing collections:', Object.keys(_db.models).join(' '));
		Object.keys(_db.models).forEach(function (key) {
			clearCollectionPromises.push(new Promise(function (res, rej) {
				_db.models[key].remove(res)
			}));
		});

		return Promise.all(clearCollectionPromises)
			.then(function () {
				_db.models = {};
				_db.modelSchemas = {};
				_db.close();
				log.info('Connection closed.');
			});
	}

	return {
		before: function () {
			return new Promise(function(resolve, reject) {
				connect().then(register).then(resolve);
			});
		},
		after: function (done) {
			close().then(done);
		},
		toLog: function(result){
			log.info(result);
			return Promise(function() {
				return result;
			})
		},
		events: {
			matchReport: require('../fixtures/MATCH_REPORT.json'),
			matchReportNotExisting: require('../fixtures/MATCH_REPORT-NOT_EXISTING.json'),
			matchStarted:require('../fixtures/MATCH_STARTED.json'),
			playerConnect: require('../fixtures/PLAYER_CONNECT.json'),
			playerDeath: require('../fixtures/PLAYER_DEATH.json'),
			playerDisconnect: require('../fixtures/PLAYER_DISCONNECT.json'),
			playerKill: require('../fixtures/PLAYER_KILL.json'),
			playerMedal: require('../fixtures/PLAYER_MEDAL.json'),
			playerStats: require('../fixtures/PLAYER_STATS.json'),
			playerStats2: require('../fixtures/PLAYER_STATS_2.json'),
			playerStatsWarmup: require('../fixtures/PLAYER_STATS_WARMUP.json'),
			playerSwithTeam: require('../fixtures/PLAYER_SWITCHTEAM.json'),
			roundOver: require('../fixtures/ROUND_OVER.json')
		}

	};
})();

module.exports = helper;