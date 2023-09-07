require('dotenv').config({path: '../.config/.env'});

const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});

const {healthCheck, router} = require('../app/components/indexRoutes');
const responseGenerator = require("../app/helpers/responseGenerator");

const healthCheckRoutePath = '/health-check';

const PORT = 3002;
const server = express();

// enable body parsing
server.use(bodyParser.json());

server.use(cors);

// disable 'X-Powered-By' header in response
server.disable('x-powered-by');
// Route health-check request
server.get(healthCheckRoutePath, healthCheck);
// route incoming requests to controller
server.use('/', router);

server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on ${PORT}`);
});

// catch 404 and forward to error handler
server.use((_request, response, _next) => {
    response.status(404).send(responseGenerator.getErrorResponse(new Error('NOT_FOUND')).body);
});

// other type of errors, it *might* also be a Runtime Error
server.use((err, request, response, _next) => {
    const errorResponse = responseGenerator.getErrorResponse(err, request, null);
    response.status(errorResponse.httpStatusCode || 500).send(errorResponse.body);
});

module.exports = server;
