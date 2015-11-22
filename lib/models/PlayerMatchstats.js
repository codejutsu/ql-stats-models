var Q = require('q'),
		mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		PlayerMatchStats,
		game_stats = require('../game/stats'),
		playerMatchStatsSchema = new Schema({
			playerRank: {
				elo: {
					before: Number,
					efter: Number
				}
			},
			player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
			match: {type: mongoose.Schema.Types.ObjectId, ref: 'MatchReport'},
			game_type: String,
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
			game_stats: game_stats
		});

playerMatchStatsSchema.statics.createFrom = function (event) {

	// When accessing MatchReport from PlayerStatsUnitTest.js shit goes fucking south, i don't know why..

	var Player = mongoose.model('Player'),
		MatchReport = mongoose.model('MatchReport');

	return Q.all([
		Player.findBySteamId(event.DATA.STEAM_ID).then(),
		MatchReport.findByGuid(event.DATA.MATCH_GUID).then()
	]).then(function (result) {
		var player = result[0],
				match = result[1];

		return new PlayerMatchStats({
			player: player._id,
			match: match._id,
			game_type: match.game_type,
			match_guid: event.DATA.MATCH_GUID,
			aborted: event.DATA.ABORTED,
			steam_id: event.DATA.STEAM_ID,
			nick: event.DATA.NAME,
			warmup: event.DATA.WARMUP,
			// Rank
			rank: event.DATA.RANK,
			team_rank: event.DATA.TEAM_RANK || '',
			tied_rank: event.DATA.TIED_RANK,
			tied_team_rank: event.DATA.TIED_TEAM_RANK || '',
			game_stats: {
				// general
				play_time: event.DATA.PLAY_TIME,
				win: event.DATA.WIN,
				quit: event.DATA.QUIT,
				lose: event.DATA.LOSE,
				kills: event.DATA.KILLS,
				deaths: event.DATA.DEATHS,
				damage_dealt: event.DATA.DAMAGE.DEALT,
				damage_taken: event.DATA.DAMAGE.TAKEN,
				max_streak: event.DATA.MAX_STREAK,
				// medals
				accuracy: event.DATA.MEDALS.ACCURACY,
				assists: event.DATA.MEDALS.ASSISTS,
				captures: event.DATA.MEDALS.CAPTURES,
				combokill: event.DATA.MEDALS.COMBOKILL,
				defends: event.DATA.MEDALS.DEFENDS,
				excellent: event.DATA.MEDALS.EXCELLENT,
				firstfrag: event.DATA.MEDALS.FIRSTFRAG,
				headshot: event.DATA.MEDALS.HEADSHOT,
				humiliation: event.DATA.MEDALS.HUMILIATION,
				impressive: event.DATA.MEDALS.IMPRESSIVE,
				midair: event.DATA.MEDALS.MIDAIR,
				perfect: event.DATA.MEDALS.PERFECT,
				perforated: event.DATA.MEDALS.PERFORATED,
				quadgod: event.DATA.MEDALS.QUADGOD,
				rampage: event.DATA.MEDALS.RAMPAGE,
				revenge: event.DATA.MEDALS.REVENGE,

				// pickups
				ammo: event.DATA.PICKUPS.AMMO,
				armor: event.DATA.PICKUPS.ARMOR,
				armor_regen: event.DATA.PICKUPS.ARMOR_REGEN,
				battlesuit : event.DATA.PICKUPS.BATTLESUIT,
				doubler: event.DATA.PICKUPS.DOUBLER,
				flight : event.DATA.PICKUPS.FLIGHT,
				green_armor: event.DATA.PICKUPS.GREEN_ARMOR,
				guard: event.DATA.PICKUPS.GUARD,
				haste: event.DATA.PICKUPS.HASTE,
				health : event.DATA.PICKUPS.HEALTH,
				invis: event.DATA.PICKUPS.INVIS,
				invulnerability: event.DATA.PICKUPS.INVULNERABILITY,
				kamikaze : event.DATA.PICKUPS.KAMIKAZE,
				medkit : event.DATA.PICKUPS.MEDKIT,
				mega_health: event.DATA.PICKUPS.MEGA_HEALTH,
				other_holdable : event.DATA.PICKUPS.OTHER_HOLDABLE,
				other_powerup: event.DATA.PICKUPS.OTHER_POWERUP,
				portal : event.DATA.PICKUPS.PORTAL,
				quad : event.DATA.PICKUPS.QUAD,
				red_armor: event.DATA.PICKUPS.RED_ARMOR,
				regen: event.DATA.PICKUPS.REGEN,
				scout: event.DATA.PICKUPS.SCOUT,
				teleporter : event.DATA.PICKUPS.TELEPORTER,
				yellow_armor : event.DATA.PICKUPS.YELLOW_ARMOR,

				// weapons
				gauntlet_d: event.DATA.WEAPONS.GAUNTLET.D,
				gauntlet_dg: event.DATA.WEAPONS.GAUNTLET.DG,
				gauntlet_dr: event.DATA.WEAPONS.GAUNTLET.DR,
				gauntlet_h: event.DATA.WEAPONS.GAUNTLET.H,
				gauntlet_k: event.DATA.WEAPONS.GAUNTLET.K,
				gauntlet_p: event.DATA.WEAPONS.GAUNTLET.P,
				gauntlet_s: event.DATA.WEAPONS.GAUNTLET.S,
				gauntlet_t: event.DATA.WEAPONS.GAUNTLET.T,

				rocket_p: event.DATA.WEAPONS.ROCKET.P,
				rocket_k: event.DATA.WEAPONS.ROCKET.K,
				rocket_d: event.DATA.WEAPONS.ROCKET.D,
				rocket_s: event.DATA.WEAPONS.ROCKET.S,
				rocket_h: event.DATA.WEAPONS.ROCKET.H,
				rocket_t: event.DATA.WEAPONS.ROCKET.T,
				rocket_dg: event.DATA.WEAPONS.ROCKET.DG,
				rocket_dr: event.DATA.WEAPONS.ROCKET.DR,

				lightning_p: event.DATA.WEAPONS.LIGHTNING.P,
				lightning_k: event.DATA.WEAPONS.LIGHTNING.K,
				lightning_d: event.DATA.WEAPONS.LIGHTNING.D,
				lightning_s: event.DATA.WEAPONS.LIGHTNING.S,
				lightning_h: event.DATA.WEAPONS.LIGHTNING.H,
				lightning_t: event.DATA.WEAPONS.LIGHTNING.T,
				lightning_dg: event.DATA.WEAPONS.LIGHTNING.DG,
				lightning_dr: event.DATA.WEAPONS.LIGHTNING.DR,

				railgun_p: event.DATA.WEAPONS.RAILGUN.P,
				railgun_k: event.DATA.WEAPONS.RAILGUN.K,
				railgun_d: event.DATA.WEAPONS.RAILGUN.D,
				railgun_s: event.DATA.WEAPONS.RAILGUN.S,
				railgun_h: event.DATA.WEAPONS.RAILGUN.H,
				railgun_t: event.DATA.WEAPONS.RAILGUN.T,
				railgun_dg: event.DATA.WEAPONS.RAILGUN.DG,
				railgun_dr: event.DATA.WEAPONS.RAILGUN.DR,

				plasma_p: event.DATA.WEAPONS.PLASMA.P,
				plasma_k: event.DATA.WEAPONS.PLASMA.K,
				plasma_d: event.DATA.WEAPONS.PLASMA.D,
				plasma_s: event.DATA.WEAPONS.PLASMA.S,
				plasma_h: event.DATA.WEAPONS.PLASMA.H,
				plasma_t: event.DATA.WEAPONS.PLASMA.T,
				plasma_dg: event.DATA.WEAPONS.PLASMA.DG,
				plasma_dr: event.DATA.WEAPONS.PLASMA.DR,

				grenade_p: event.DATA.WEAPONS.GRENADE.P,
				grenade_k: event.DATA.WEAPONS.GRENADE.K,
				grenade_d: event.DATA.WEAPONS.GRENADE.D,
				grenade_s: event.DATA.WEAPONS.GRENADE.S,
				grenade_h: event.DATA.WEAPONS.GRENADE.H,
				grenade_t: event.DATA.WEAPONS.GRENADE.T,
				grenade_dg: event.DATA.WEAPONS.GRENADE.DG,
				grenade_dr: event.DATA.WEAPONS.GRENADE.DR,

				bfg_p: event.DATA.WEAPONS.BFG.P,
				bfg_k: event.DATA.WEAPONS.BFG.K,
				bfg_d: event.DATA.WEAPONS.BFG.D,
				bfg_s: event.DATA.WEAPONS.BFG.S,
				bfg_h: event.DATA.WEAPONS.BFG.H,
				bfg_t: event.DATA.WEAPONS.BFG.T,
				bfg_dg: event.DATA.WEAPONS.BFG.DG,
				bfg_dr: event.DATA.WEAPONS.BFG.DR,

				hmg_p: event.DATA.WEAPONS.HMG.P,
				hmg_k: event.DATA.WEAPONS.HMG.K,
				hmg_d: event.DATA.WEAPONS.HMG.D,
				hmg_s: event.DATA.WEAPONS.HMG.S,
				hmg_h: event.DATA.WEAPONS.HMG.H,
				hmg_t: event.DATA.WEAPONS.HMG.T,
				hmg_dg: event.DATA.WEAPONS.HMG.DG,
				hmg_dr: event.DATA.WEAPONS.HMG.DR,

				chaingun_p: event.DATA.WEAPONS.CHAINGUN.P,
				chaingun_k: event.DATA.WEAPONS.CHAINGUN.K,
				chaingun_d: event.DATA.WEAPONS.CHAINGUN.D,
				chaingun_s: event.DATA.WEAPONS.CHAINGUN.S,
				chaingun_h: event.DATA.WEAPONS.CHAINGUN.H,
				chaingun_t: event.DATA.WEAPONS.CHAINGUN.T,
				chaingun_dg: event.DATA.WEAPONS.CHAINGUN.DG,
				chaingun_dr: event.DATA.WEAPONS.CHAINGUN.DR,

				nailgun_p: event.DATA.WEAPONS.NAILGUN.P,
				nailgun_k: event.DATA.WEAPONS.NAILGUN.K,
				nailgun_d: event.DATA.WEAPONS.NAILGUN.D,
				nailgun_s: event.DATA.WEAPONS.NAILGUN.S,
				nailgun_h: event.DATA.WEAPONS.NAILGUN.H,
				nailgun_t: event.DATA.WEAPONS.NAILGUN.T,
				nailgun_dg: event.DATA.WEAPONS.NAILGUN.DG,
				nailgun_dr: event.DATA.WEAPONS.NAILGUN.DR,

				proximitymine_p: event.DATA.WEAPONS.PROXMINE.P,
				proximitymine_k: event.DATA.WEAPONS.PROXMINE.K,
				proximitymine_d: event.DATA.WEAPONS.PROXMINE.D,
				proximitymine_s: event.DATA.WEAPONS.PROXMINE.S,
				proximitymine_h: event.DATA.WEAPONS.PROXMINE.H,
				proximitymine_t: event.DATA.WEAPONS.PROXMINE.T,
				proximitymine_dg: event.DATA.WEAPONS.PROXMINE.DG,
				proximitymine_dr: event.DATA.WEAPONS.PROXMINE.DR,

				shotgun_p: event.DATA.WEAPONS.SHOTGUN.P,
				shotgun_k: event.DATA.WEAPONS.SHOTGUN.K,
				shotgun_d: event.DATA.WEAPONS.SHOTGUN.D,
				shotgun_s: event.DATA.WEAPONS.SHOTGUN.S,
				shotgun_h: event.DATA.WEAPONS.SHOTGUN.H,
				shotgun_t: event.DATA.WEAPONS.SHOTGUN.T,
				shotgun_dg: event.DATA.WEAPONS.SHOTGUN.DG,
				shotgun_dr: event.DATA.WEAPONS.SHOTGUN.DR,

				other_p: event.DATA.WEAPONS.OTHER_WEAPON.P,
				other_k: event.DATA.WEAPONS.OTHER_WEAPON.K,
				other_d: event.DATA.WEAPONS.OTHER_WEAPON.D,
				other_s: event.DATA.WEAPONS.OTHER_WEAPON.S,
				other_h: event.DATA.WEAPONS.OTHER_WEAPON.H,
				other_t: event.DATA.WEAPONS.OTHER_WEAPON.T,
				other_dg: event.DATA.WEAPONS.OTHER_WEAPON.DG,
				other_dr: event.DATA.WEAPONS.OTHER_WEAPON.DR

			}
		}).save()
	});
};

playerMatchStatsSchema.statics.findByGuid = function (guids) {
	return PlayerMatchStats.find()
			.where('match_guid')
			.in(guids)
			.exec();
};

module.exports = PlayerMatchStats = mongoose.model('PlayerMatchStats', playerMatchStatsSchema);

