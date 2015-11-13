var mongoose =  require('mongoose'),
    models = require('../../index'),
    Player = models.Player,
    expect = require('chai').expect;

describe('When trying to create a player', function () {

    before(function () {
        mongoose.connect('mongodb://localhost/ql-stats-test');
    });

    after(function () {

        // NOTE: Please don't forget to clean out all collections you used.
        Player.remove();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mongoose.disconnect();
    });


    it('should be able to create a user', function (done) {

        var player = new Player({
            profile: {
                steam_id: 'apa'
            }
        });

        player.save(done);

    });

});