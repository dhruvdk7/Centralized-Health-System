const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const { generateJwtWebToken, decodeJwtToken } = require('../helpers/jwt');
const { jwtConfig } = require('../config');

describe('generateJwtWebToken', () => {
    const userId = '1';
    const role = 'ADMIN';
    it('Should generate a token with a specified expiration time', () => {
        const keepUserLoggedIn = true;
        const token = generateJwtWebToken(userId, role, keepUserLoggedIn);
    });
});

describe('decodeJwtToken', () => {
    it('should decode a valid JWT token', async () => {
        const token = jwt.sign({ id: '1', role: 'ADMIN' }, jwtConfig.secretKey);
        const response = await decodeJwtToken(token);
        expect(response).to.have.property('id');
        expect(response).to.have.property('role');
    });
});
