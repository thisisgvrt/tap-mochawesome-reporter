"use strict";
const uuidV4 = require('uuid/v4')

var Parser = require('tap-parser');

class TapTest {
    constructor (assert, suite) {
        this.assert = assert;
        this.uuid = uuidV4();
        this.parent = suite;

    }

    pass() {
        return this.assert.ok;
    }


    fail() {
        return !this.assert.ok;
    }

    pending() {
        return false;
    }
    skipped() {
        return false;
    }

    json() {
        return {
            // "rawAssert": this.assert,
            'title': this.assert.name,
            'fullTitle': this.assert.name,
            'timedOut': false,
            'duration': 0,
            'speed': 'fast',
            'pass': this.pass(),
            'fail': this.fail(),
            'pending': this.pending(), //fixme
            'code': '',
            'isRoot': false,
            'uuid': this.uuid,
            'parentUUID': this.parent.uuid,
            'skipped': this.skipped(), //fixme
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

    _getChildenSuitesFuncCount(fname) {
        const childrenCounts =  this.suites.map(function(i){return i[fname]()});
        if (childrenCounts.length==0) return 0;
        console.log(childrenCounts, fname);
        return childrenCounts.reduce(function(a, v) { return a + v; });
    }
    testsCount() {
        return this.tests.length + this._getChildenSuitesFuncCount("testsCount");
    }
    suitesCount() {
        return this.suites.length + this._getChildenSuitesFuncCount("suitesCount");
    }

    skipped() {
        return this.tests.filter(t=> { return t.skipped() })
    }

    pending() {
        return this.tests.filter(t=> { return t.pending() })
    }

    passes() {
        return this.tests.filter(t=> { return t.pass() })
    }

    failures() {
        return this.tests.filter(t=> { return t.fail() })
    }


    pendingCount() {
        return this.pending().length + this._getChildenSuitesFuncCount("pendingCount");
    }

    passesCount() {
        console.dir(this);
        return this.passes().length + this._getChildenSuitesFuncCount("passesCount");
    }

    failuresCount() {
        return this.failures().length + this._getChildenSuitesFuncCount("failuresCount");
    }



    json() {
        return {
            'title': this.name,
            'suites': this.suites.map(function(i){return i.json()}),
            'tests': this.tests.map(function(i){return i.json()}),
            'pending': this.pending().length,
            'root': this.isRoot,
            'fullFile': '',
            'file': '',
            'passes': this.passes().length,
            'failures': this.failures().length,
            'skipped': this.skipped().length,
            'duration': 0,
            'rootEmpty': false,
            '_timeout': 0,
            'uuid': this.uuid,
            'beforeHooks': [],
            'afterHooks': []
        }
    }

}



module.exports = function(inStream, callback) {
var p = new Parser();
var rootSuite = new TapSuite(p, true, function() {


    var result = 
{
  "stats": {
    "suites": rootSuite.suitesCount(),
    "tests": rootSuite.testsCount(),
    "passes": rootSuite.passesCount(),
    "pending": rootSuite.pendingCount(),
    "failures": rootSuite.failuresCount(),
    "start": new Date().toISOString(),
    "end": new Date().toISOString(),
    "duration": 0,
    "testsRegistered": rootSuite.testsCount(),
    "passPercent": rootSuite.passesCount()/rootSuite.testsCount() *100.0,
    "pendingPercent": rootSuite.pendingCount()/rootSuite.testsCount()*100.0,
    "other": 0,
    "hasOther": false,
    "skipped": 0,
    "hasSkipped": false,
    "passPercentClass": "danger",
    "pendingPercentClass": "danger"
  },
  "suites": rootSuite.json(),
    "copyrightYear": (new Date()).getFullYear()
}
    callback(result);
});

inStream.pipe(p);

}


