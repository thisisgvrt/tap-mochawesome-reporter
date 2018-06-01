"use strict";
const uuidV4 = require('uuid/v4')

var Parser = require('tap-parser');

class TapTest {
    constructor (assert, suite) {
        this.assert = assert;
        this.uuid = uuidV4();
        this.parent = suite;

    }

    json() {
        return {
            // "rawAssert": this.assert,
            'title': this.assert.name,
            'fullTitle': this.assert.name,
            'timedOut': false,
            'duration': 0,
            'speed': 'fast',
            'pass': this.assert.ok,
            'fail': !this.assert.ok,
            'pending': false, //fixme
            'code': '',
            'isRoot': false,
            'uuid': this.uuid,
            'parentUUID': this.parent.uuid,
            'skipped': false, //fixme
            'isHook': false,
            'context': "",//this._comments,
            'state': formatState(this.assert.ok),
            'err': {} //fimxe 
        }
    }
}

function formatError (error){
    let err = {}

    if (error) {
        err.name = error.type
        err.message = error.message
        err.estack = error.stack
        err.stack = error.stack
        if (error.actual && error.expected) {
            err.showDiff = true
            err.actual = error.actual
            err.expected = error.expected
        }
    }

    return err
}


function formatState (state){
    switch (state) {
        case true :
            return 'passed'
            break;
        case false:
            return 'failed'
            break;
        default:
            break;
    }
}


class TapSuite {
    constructor (parser, isRoot, cb) {
        var p = this.parser = parser;
        this.suites = [];
        this.tests = [];
        this.name = parser.name || "";
        this._comments = [];
        this.isRoot = isRoot;
        this.uuid = uuidV4();
        this.passes = 0;
        this.failures = 0;
        this.pending = 0;
        this.skipped = 0;

        p.on('complete', (results) => {
            cb(this);
        });

		p.on('assert', (assert) => {
			this.addTest(new TapTest(assert, this));


		});

		p.on('comment', (comment) => {
			this.addComment(comment);

		})

		p.on('child', (childParser) => {
			var newSuite = new TapSuite(childParser, false, function() {});
			this.addSuite(newSuite);


		});

    }

    addComment(comment) {
        this._comments.push(comment);
    }

    addTest(test) {
        test._comments = this._comments;
        this._comments = [];
        this.tests.push(test);
    }

    addSuite(suite) {
        this.suites.push(suite);
    }

    json() {
        return {
            'title': this.name,
            'suites': this.suites.map(function(i){return i.json()}),
            'tests': this.tests.map(function(i){return i.json()}),
            'pending': [],
            'root': this.isRoot,
            'fullFile': '',
            'file': '',
            'passes': [],
            'failures': [],
            'skipped': [],
            // 'hasTests': this.tests.length > 0,
            // 'hasSuites': this.suites.length > 0,
            // 'totalTests': this.tests.length,
            // 'totalPasses': this.passes,
            // 'totalFailures': this.failures,
            // 'totalPending': this.pending,
            // 'totalSkipped': this.skipped,
            // 'hasPasses': this.passes>0,
            // 'hasFailures': this.failures>0,
            // 'hasPending': this.pending>0,
            // 'hasSkipped': this.skipped>0,
            'duration': 0,
            'rootEmpty': false,
            '_timeout': 0,
            'uuid': this.uuid,
            // 'hasBeforeHooks': false,
            'beforeHooks': [],
            // 'hasAfterHooks': false,
            'afterHooks': []
        }
    }

}


var p = new Parser();


var rootSuite = new TapSuite(p, true, function() {


    var result = 
{
  "stats": {
    "suites": 6,
    "tests": 7,
    "passes": 3,
    "pending": 1,
    "failures": 3,
    "start": "2017-06-06T02:47:10.465Z",
    "end": "2017-06-06T02:47:10.486Z",
    "duration": 21,
    "testsRegistered": 9,
    "passPercent": 37.5,
    "pendingPercent": 11.1,
    "other": 1,
    "hasOther": true,
    "skipped": 2,
    "hasSkipped": true,
    "passPercentClass": "danger",
    "pendingPercentClass": "danger"
  },
  "suites": rootSuite.json(),
    "copyrightYear": 2017
}
    console.log(JSON.stringify(result, null, 4));
});

process.stdin.pipe(p);
