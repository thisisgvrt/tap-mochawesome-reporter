# tap-mochawesome-reporter

<img align="right" src="https://github.com/adamgruber/mochawesome-report-generator/blob/master/docs/marge-report-1.0.1.png?raw=true" alt="Mochawesome Report" width="55%" />

Turns your .tap file into .json for gorgeous [Mochawesome](https://github.com/adamgruber/mochawesome) report generator!

## Installation

    npm install --global tap-mochawesome-reporter
    npm install --global mochawesome-report-generator

## Usage


    tap test/*.js | node_modules/.bin/tap-mochawesome-reporter > test_output.json
    marge test_output.json

    ✓ Reports saved:
    myproject/mochawesome-report/test_output.html


## [Result](https://github.com/adamgruber/mochawesome-report-generator/blob/master/docs/marge-report-1.0.1.png) (Is really gorgeous!)

## [mochawesome-report-generator](https://github.com/adamgruber/mochawesome-report-generator) repo
