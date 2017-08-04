const tap = require('tap'),
	mam = require('../my-awesome-module.js');

// Always call as (found, wanted) by convention
tap.equal(mam(1), 'odd');
tap.equal(mam(2), 'even');
