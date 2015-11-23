var Q = require('q');

module.exports = function (connection) {
        require('./GlobalStats')(connection);
        require('./MatchReport')(connection);
        require('./Player')(connection);
        require('./PlayerMatchStats')(connection);
        require('./Server')(connection);
        require('./ServerNetwork')(connection);
    return connection
};