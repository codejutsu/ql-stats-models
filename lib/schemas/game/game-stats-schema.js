var gameStatsSchemaDefinition = require('./game-stats-schema-definition'),
	Schema = require('mongoose').Schema;

module.exports = {
	overall: new Schema(gameStatsSchemaDefinition),
	ad:new Schema(gameStatsSchemaDefinition),
	dom:new Schema(gameStatsSchemaDefinition),
	duel:new Schema(gameStatsSchemaDefinition),
	ffa:new Schema(gameStatsSchemaDefinition),
	race:new Schema(gameStatsSchemaDefinition),
	rr:new Schema(gameStatsSchemaDefinition),
	tdm:new Schema(gameStatsSchemaDefinition)
};
