var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function makeGunSchemaProperty (object, type, key) {
    ['p', 'k', 'd', 's', 'h', 't', 'dg', 'dr'].forEach(function (keyPrefix) {
        object[key + keyPrefix] = type;
    });
}
var schemaBase = {
        guid: String,
        steam_id: String,
        nick: String,
        warmup: Number,
// Global stats
        win: Number,
        quit: Number,
        play_time: Number,
        team: Number,
// Rank
        rank: Number,
        team_rank: Number,
        tied_rank: Number,
        tied_team_rank: Number,
        damage_dealt: Number,
        damage_taken: Number,
        score: Number,
        kills: Number,
        deaths: Number,
        max_streak: Number,

//    -- MEDALS --
        accuracy: Number,
        assists: Number,
        captures: Number,
        combokill: Number,
        defends: Number,
        excellent: Number,
        firstfrag: Number,
        headshot: Number,
        humiliation: Number,
        impressive: Number,
        midair: Number,
        perfect: Number,
        perforated: Number,
        quadgod: Number,
        rampage: Number,
        revenge: Number,
//    -- PICKUPS --
        ammo: Number,
        armor: Number,
        armor_regen: Number,
        battlesuit: Number,
        doubler: Number,
        flight: Number,
        green_armor: Number,
        guard: Number,
        haste: Number,
        health: Number,
        invis: Number,
        invulnerability: Number,
        kamikaze: Number,
        medkit: Number,
        mega_health: Number,
        other_holdable: Number,
        other_powerup: Number,
        portal: Number,
        quad: Number,
        red_armor: Number,
        regen: Number,
        scout: Number,
        teleporter: Number,
        yellow_armor: Number,
        gauntlet_k: Number,
        gauntlet_d: Number,
        gauntlet_dg: Number,
        gauntlet_dr: Number,
        gauntlet_t: Number
    },
    guns = [
        'machinegun',
        'rocket',
        'lightning',
        'railgun',
        'plasma',
        'grenade',
        'bfg',
        'hmg',
        'chaingun',
        'nailgun',
        'proximitymine',
        'shotgun',
        'other'
    ];

guns.forEach(function (gun) {
    makeGunSchemaProperty(schemaBase, Number, gun);
});

var playerMatchStatsSchema = new Schema(schemaBase);

module.exports = mongoose.model('PlayerMatchStats', playerMatchStatsSchema);

