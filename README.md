# AWI Auth Back
The back end autentication part of the AWI project.

## Setup
First, you need to start the database: `docker-compose up db`.

You need Node.js (version >= 10) & npm. Once installed simply run `npm install` followed by `npm start` and you should be running.
The `npm start-watch` command also start [nodemon](https://nodemon.io/). Nodemon monitor your changes and so, it reload your files when you changes them.

## Tests
They work using [jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest). Jest allow to make tests using a simple API and supertest allow to test very easly an HTTP server. To run the tests once use `npm run test`. To run the test after each changes use `npm run test-watch`.

### Tests with coverage
They work using [jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest). Jest allow to make tests using a simple API and supertest allow to test very easly an HTTP server. 
Test coverage is defined as a metric that measures the amount of testing performed by a set of test. 
It will include gathering information about which parts of a program are executed when running the test suite to 
determine which branches of conditional statements have been taken.

To run the tests with coverage once use `npm run test`. To run the test after each changes use `npm test -- --coverage`.

---

## Docker
For easier deployment and integration with dokku this project use [docker](https://www.docker.com/). The file allowing to build the docker image is the `dockerfile`. The image is based on [LTS node 10](https://hub.docker.com/_/node) from docker hub. To build the image simply run `docker build -t <your username>/awi-auth-back .`, once the image is build use `docker run -p 49160:3000 -d <your username>/awi-auth-back` to run the image. More information on the official node + docker [documentation](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).

## Style
This project use [standard](https://standardjs.com/). Standard help to improve code readability by standardizing code style. To run standard type `npm run style`. To let standard auto fix the errors type `npm run style-fix`.
