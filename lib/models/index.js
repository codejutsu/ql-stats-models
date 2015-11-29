module.exports = function (db) {
        require('./GameStats')(db);
        require('./GlobalStats')(db);
        require('./MatchReport')(db);
        require('./Player')(db);
        require('./PlayerMatchStats')(db);
        require('./Server')(db);
        require('./ServerNetwork')(db);
    return db
};