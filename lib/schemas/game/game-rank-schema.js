 var gameRankSchemaDefinition = require('./game-rank-schema-definition'),
	 Schema = require('mongoose').Schema;

gameRankSchema = {
	 overall: new Schema(gameRankSchemaDefinition),
	 ad: new Schema(gameRankSchemaDefinition),
	 dom: new Schema(gameRankSchemaDefinition),
	 duel: new Schema(gameRankSchemaDefinition),
	 ffa: new Schema(gameRankSchemaDefinition),
	 race: new Schema(gameRankSchemaDefinition),
	 rr: new Schema(gameRankSchemaDefinition),
	 tdm: new Schema(gameRankSchemaDefinition)
 };

module.exports = gameRankSchema;