var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
    profile: {
        steam: {
            id: String
        }
    },
    ELO: {
      DUEL: Number
    },
    stats: {
        overall: {
            games: Number,
            play_time: Number,
            win: Number,
            quit: Number,
            kills: Number,
            deaths: Number,
            damage_dealt: Number,
            damage_taken: Number
        },
        duel: {
            games: Number,
            play_time: Number,
            win: Number,
            quit: Number,
            kills: Number,
            deaths: Number,
            damage_dealt: Number,
            damage_taken: Number,
            rank: {
                elo: {
                    type: Number,
                    default: 1200
                }
            }
        },
        tdm: {
            games: Number,
            play_time: Number,
            win: Number,
            quit: Number,
            kills: Number,
            deaths: Number,
            damage_dealt: Number,
            damage_taken: Number,
            rank: {
                elo: {
                    type: Number,
                    default: 1200
                }
            }
        },
        ctf: {
            games: Number,
            play_time: Number,
            win: Number,
            quit: Number,
            kills: Number,
            deaths: Number,
            damage_dealt: Number,
            damage_taken: Number,
            rank: {
                elo: {
                    type: Number,
                    default: 1200
                }
            }
        },
        ffa: {
            games: Number,
            play_time: Number,
            win: Number,
            quit: Number,
            kills: Number,
            deaths: Number,
            damage_dealt: Number,
            damage_taken: Number,
            rank: {
                elo: {
                    type: Number,
                    default: 1200
                }
            }
        }
    }
});

module.exports = mongoose.model('Player', playerSchema);
