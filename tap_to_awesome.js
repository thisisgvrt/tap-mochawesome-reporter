var tap_to_awesome = require("./index.js");

tap_to_awesome(process.stdin, function(result) {
	console.log(JSON.stringify(result, null, 4));
})