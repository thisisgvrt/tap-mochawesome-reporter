#!/usr/bin/env node


var tap_to_awesome = require("tap-mochawesome-reporter");

tap_to_awesome(process.stdin, function(result) {
	console.log(JSON.stringify(result, null, 4));
})