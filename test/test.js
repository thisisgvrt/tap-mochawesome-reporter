const tap = require('tap')
const tapToAwesome = require('../')
const fs = require('fs');
const path = require('path');

tap.test('basic', function (childTest) {
  const file = fs.createReadStream(path.join(__dirname,'data','multiple.tap'));
  tapToAwesome(file, function(result) {
  	const expected = require(path.join(__dirname,'data','multiple.json'));
  	tap.equal(result, expected);
  	childTest.end()
  })
})
