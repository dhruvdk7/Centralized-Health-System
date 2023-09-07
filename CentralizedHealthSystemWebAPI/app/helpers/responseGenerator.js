const errorCodes = require('../constants/errorCodes');
const { ValidationError } = require('../lib/expressValidation');

const getFullURL = ((req) => `${req.protocol}://${req.headers.host}${req.originalUrl}`);

class ResponseGenerator {
    validationError(err) {
        const errors = [];
        Object.keys(err.details).forEach((key) => {
            err.details[key].forEach((e) => {
                errors.push({
                    location: key,
                    messages: [e.message],
                    field: e.path[0],
                });
            });
        });
        return {
            httpStatusCode: err.statusCode,
            body: {
                code: err.name,
                message: 'Request parameters are not valid',
                errors,
            },
        };
    }

    generateErrorResponse(code, payload) {
        if (payload) return errorCodes[code](payload) || errorCodes.INTERNAL_SERVER_ERROR;
        return errorCodes[code] || errorCodes.INTERNAL_SERVER_ERROR;
    }

    assignRequestParametersToError(request, error) {
        error.url = getFullURL(request);
        error.data = request.body;
        error.method = request.method;
        error.ip = request.ip;
    }

    handleJwtTokenError(request, error) {
        return {
            httpStatusCode: error.status,
            body: {
                code: error.code,
                message: error.inner.message,
            },
        };
    }

    getErrorResponse(error, request, payload) {
        console.log(error);
        if (error instanceof ValidationError) {
            return this.validationError(error);
        }
        if (error.name == "UnauthorizedError") {
            return this.handleJwtTokenError(request, error);
        }
        if (request) {
            this.assignRequestParametersToError(request, error);
        }
        return this.generateErrorResponse(error.message, payload);
    }
}

module.exports = new ResponseGenerator();
