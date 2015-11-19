var extend = require('../util/extend'),
	schema = {};

extend(schema, require('./weapons'));
extend(schema, require('./general'));
extend(schema, require('./medals'));
extend(schema, require('./pickups'));
