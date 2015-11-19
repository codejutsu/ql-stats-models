# On match start

- Add player to live list (redis)
- Add match to current matches (redis)
- Update server status to live (redis)
- Update global map counter (redis/mongodb)
- Update global game-mode/map counter (redis/mongodb)
- Run global event emit filtering (is highly ranked player, notify followers)
- Add player match stats and and current rank to match (mongodb/redis)
- Associate playing players with match (mongodb)


# On match report
- Remove from player live list (redis)
- Remove match from current matches (redis)
- Add match to global latest games (redis)
- Add match to player latest games list (redis)
- Add to map latest games list (redis)
- Get winning team/losing team, for each rank provider calculate new rank (node.js)
- Update match information with win/losing teams (mongodb/redis)
- Update global rank list (redis)
- Update regional rank list (redis)
- Update private rank group (only vs players in this rank group)
- Add match to player games (mongodb)
- Add match to player latest games (redis)
- Add win/loss to player counters (mongodb/redis)
- Add stats to players counters (mongodb/redis)
- Update player global rank (redis)

# On player stats

- Add to player latest stats (mongodb/redis)
- Update global stats (redis/mongdb)
- Update game mode stats  (redis)
- Ping user online (redis)

# On player disconnect

- Remove from in-game list (redis)
- Ping user online session (redis)