# Quake Live Mongoose Schemas

# Quick Start

```
    npm install ql-stats-models
    var models = require('ql-stats-models');
```

# Running tests

Running Mocha recursive with watch is broken due to some underlying issue with mongoose, working on solving it.
```
    $ mocha test --recursive --watch    
```

For now your better of running the tests individually.

```
    $ mocha test/unit/MatchReportedUnitTest.js
    $ mocha test/unit/MatchStartedUnitTest.js
    $ mocha test/unit/PlayerConnectUnitTest.js
    $ mocha test/unit/PlayerDisconnectUnitTest.js
    $ mocha test/unit/PlayerStatsUnitTest.js
    $ mocha test/unit/PlayerUnitTest.js
```

# How could I use these schemas

Start a new git repository and ```npm install ql-server-monitor ql-stats-models --save```.
Start monitoring your servers and when they fire game events, use the GAME EVENT data with the ql-stats-models.np
