const { expect } = require('chai');
const { generateHashPassword, compareHashPassword, generateCryptoRandomString } = require('../lib/crypto');

describe('generateHashPassword', () => {
    it('Should generate hash and salt for password', () => {
        const password = 'password';
        const response = generateHashPassword(password);
        expect(response).to.have.property('hashPassword');
        expect(response).to.have.property('salt');
        expect(response.hashPassword).to.have.lengthOf(128);
        expect(response.salt).to.have.lengthOf(32);
    });
    it('Password should not be equal to hash password', () => {
        const password = 'password';
        const response = generateHashPassword(password);
        expect(response).to.have.property('hashPassword');
        expect(response).to.have.property('salt');
        expect(password).to.not.equal(response.hashPassword);
    });
});

describe('compareHashPassword', () => {
    it('Should return valid hash password if user password is valid', () => {
        const password = 'password';
        const response = generateHashPassword(password);
        const hashPassword = compareHashPassword(password, response.salt);
        expect(response.hashPassword).to.equal(hashPassword);
    });
    it('Should not return valid hash password if user password is not valid', () => {
        const password = 'password';
        const inValidPassword = 'invalidPassword';
        const response = generateHashPassword(password);
        const hashPassword = compareHashPassword(inValidPassword, response.salt);
        expect(response.hashPassword).to.not.equal(hashPassword);
    });
});

describe('generateCryptoRandomString', () => {
    it('Should return a string with length of 96 character', () => {
        const response = generateCryptoRandomString();
        expect(response).to.have.lengthOf(96);
    });
    it('Multiple string generated with this method should not be same', () => {
        const response1 = generateCryptoRandomString();
        const response2 = generateCryptoRandomString();
        expect(response1).to.not.equal(response2);
    });
});
