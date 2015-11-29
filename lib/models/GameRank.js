var Promise = require('bluebird'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	gameRankSchemaDefinition = require('./schemas/rank-schema-definition');

module.exports = function (db) {

	var GameRank,
		gameRankSchema = new Schema(gameRankSchemaDefinition);


	GameRank = db.model('GameRank', gameRankSchema);

	return GameRank;

};

