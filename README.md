# Aleph.JS

[![CircleCI](https://circleci.com/gh/NYULibraries/aleph_js.svg?style=svg)](https://circleci.com/gh/NYULibraries/aleph_js)
[![Dependency Status](https://gemnasium.com/badges/github.com/NYULibraries/aleph_js.svg)](https://gemnasium.com/github.com/NYULibraries/aleph_js)

Javascripts for manipulating display and request functionality of the Aleph search and holdings screens.

## Run tests

```
docker-compose build
docker-compose run test
```

## Deploy to S3

```
docker-compose run deploy_s3
```

Updated file now exists at https://cdn.library.nyu.edu/aleph/application.min.js

## Writing better JavaScript

- https://github.com/airbnb/javascript
- https://github.com/getify/You-Dont-Know-JS
