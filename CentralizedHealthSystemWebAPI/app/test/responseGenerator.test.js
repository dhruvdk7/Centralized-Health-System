const { expect } = require('chai');
const responseGenerator = require('../helpers/responseGenerator');

describe('Response Generator', () => {
    it('generateErrorResponse', () => {
        const errorCode = 500;
        const response = responseGenerator.generateErrorResponse(errorCode);
        expect(response).to.have.property('httpStatusCode');
        expect(response).to.have.property('body');
    });
});
