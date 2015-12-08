var Promise = require('bluebird'),
	expect = require('chai').expect,
	helper = require('../helper'),
	MatchReport;

describe('MATCH_STARTED - When match has started.', function () {

    var matchReport;

	before(function (done) {
		function setDependencies (db) {
			MatchReport = db.model('MatchReport');
		}

        function setupScenario () {
			return Promise.all([])
		}

		helper.before()
			.then(setDependencies)
			.then(setupScenario)
            .then(function () {
			    done();
		    });
	});

	after(helper.after);

	it('should be able to create a match report', function (done) {
		MatchReport.createWithMatchStarted(helper.events.matchStarted).then(function (document) {
			expect(document._id).to.not.equal(null);
            expect(document.match_guid).to.equal('cb850666-d5e8-4310-b93b-1083fc26f658');
            matchReport = document;
			done();
		});
	});
});

