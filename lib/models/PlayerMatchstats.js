var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    gamestats = require('../gamestats'),
    schemaBase = {
        player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        match: {type: mongoose.Schema.Types.ObjectId, ref: 'Match'},
        aborted: Boolean,
        match_guid: String,
        steam_id: String,
        nick: String,
        warmup: Number,
        // Rank
		rank: Number,
		team_rank: Number,
		tied_rank: Number,
		tied_team_rank: Number,
        gamestats: gamestats
};


var playerMatchStatsSchema = new Schema(schemaBase);
module.exports = mongoose.model('PlayerMatchStats', playerMatchStatsSchema);

