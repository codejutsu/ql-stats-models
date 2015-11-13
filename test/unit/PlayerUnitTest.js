var mongoose =  require('mongoose'),
    models = require('../../index'),
    expect = require('chai').expect;

describe('When', function () {

    before(function (done) {
        mongoose.createConnection('mongodb://localhost').once('open', done);
    });

    after(function (done) {
        // drop the test database
        mongoose.disconnect(function () {
            mongoose.models = {};
            mongoose.modelSchemas = {};
            done();
        });
    });


    it('should', function () {

    });

});