# Aleph.JS

[![CircleCI](https://circleci.com/gh/NYULibraries/aleph_js.svg?style=svg)](https://circleci.com/gh/NYULibraries/aleph_js)

JavaScript for manipulating display and request functionality of the Aleph search and holdings screens.

## Run tests

```
docker-compose build
docker-compose run webpack-build
docker-compose run test
```

Or to actively develop while testing you can watch the build:

```
docker-compose run webpack-watch
docker-compose run test
# OR
docker-compose run test yarn run testem
# visit http://localhost:7357
```

## Deployed to S3

Via CircleCI

Updated file now exists at `https://cdn(-dev)?.library.nyu.edu/aleph/application.min.js`

## Writing better JavaScript

- https://github.com/airbnb/javascript
- https://github.com/getify/You-Dont-Know-JS

## Road map

- ~~Webpack~~
- Karma
- ~~Selenium/chrome-headless~~