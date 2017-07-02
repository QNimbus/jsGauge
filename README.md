[![Build Status](https://travis-ci.org/QNimbus/jsGauge.svg?branch=master)](https://travis-ci.org/QNimbus/jsGauge)
[![dependencies](https://david-dm.org/QNimbus/jsGauge.svg)](https://david-dm.org/QNimbus/jsGauge)
[![devDependencies](https://david-dm.org/QNimbus/jsGauge/dev-status.svg)](https://david-dm.org/QNimbus/jsGauge?type=dev)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

# jsGauge

jQuery plugin to display several kinds of gauges, usefull for displaying numerical data such as percentages, power readings, et cetera

## Table Of Contents

- [Installing](#installing)
- [Running the tests](#running-the-tests)
- [Deployment](#deployment)
- [Configuration](#configuration)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.


## Installing

Clone the GitHub repository locally by executing :

`git clone git@github.com:QNimbus/jsGauge.git`

Install Node dependencies with :

`npm install --production`

## Running the tests

Running the unit tests is done with :

`npm test`

## Deployment

If you are developing or constributing to this jQuery plugin you can install the development dependencies with :

`npm install`

Minifying the modified source file (in the `lib/` directory) can be done by running :

`npm run minify`

## Configuration

Copy the `config.sample.js` to `config.js` file and edit it with the parameters for your specific configuration.

| Option           | Description
|----------------- |-----------
| `todo` | *Required* todo<br><br>**Default value:** `todo`<br>**Type:** `string`<br>

## Screenshots

![alt text][screenshot_01]

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **B. van Wetten** - *Initial work* - [BeSquared](https://besqua.red)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

[screenshot_01]: img/ss_01.png "Logo Title Text 2"