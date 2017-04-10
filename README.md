# Aleph.JS

[![CircleCI](https://circleci.com/gh/NYULibraries/aleph_js.svg?style=svg)](https://circleci.com/gh/NYULibraries/aleph_js)

Javascripts for manipulating display and request functionality of the Aleph search and holdings screens.

## Run the tests

```
# Install NPM dependencies
npm install
# Run in CI mode (default)
npm test
# Run in interactive CLI mode
npm run testem
# Run in Dev mode
npm run testem-dev
# See which launchers are available
npm run testem-launchers
```

or with Docker:

```
docker build . -t aleph_js
docker run aleph_js
```

We've [prepended `grunt`](testem.json) to these above tests so that they will always be running against a backwards compatible version and we don't have to manually worry about running `grunt`.

## Compile the Javascript

### Transpile from ES2015 and minify:

```
grunt
grunt watch
```

Creates an ES5 compatible minified file at `js/dist/global.min.js`

### Just transpile from ES2015 to ES5:

```
grunt babel
```

Creates ES5 versions of `js/src/**/*.js` into `js/dist/es5/*.js`

## Environment

### Nodenv: https://github.com/nodenv/nodenv

Node/npm environment manager.

### Jasmine: https://jasmine.github.io/

Jasmine is a Javascript testing framework that let's you write rspec-like tests.

### Testem: https://github.com/testem/testem

Javascript test runner.

### Grunt: https://github.com/gruntjs/grunt

Javascript task runner to automate compilation:

- Compile ES2015 to ES5 with [Babel](http://babeljs.io)
- Minify with Uglify

## Resources

- https://github.com/airbnb/javascript
- https://github.com/getify/You-Dont-Know-JS
