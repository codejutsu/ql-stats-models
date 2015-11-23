# Quake Live Mongoose Schemas

# Quick Start

```
    npm install ql-stats-models
    var mongoose = require('mongoose'),
        connection = mongoose.createConnection('mongodb://localhost/my-db');
        
    require('ql-stats-models').register(connection).then(function (connection) {
        var Player = connection.model('Player'),
            player = new Player({
                steam_id: 'abcd'
            });
            
            player.save().then(function (result) {
                console.log(result);
            });
        
    });
        
```

# Running tests

Running Mocha recursive with watch is broken due to some underlying issue with mongoose, working on solving it.
```
    $ mocha test --recursive --watch    
```

The tests also acts as documentation on how to use these schema

# How could I use these schemas

Start a new git repository and ```npm install ql-server-monitor ql-stats-models --save```.
Start monitoring your servers and when they fire game events, use the GAME EVENT data with the ql-stats-models.
