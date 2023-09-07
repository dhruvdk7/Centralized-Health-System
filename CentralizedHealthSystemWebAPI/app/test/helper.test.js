const { expect } = require('chai');

const { generateRandomVerificationCode } = require('../helpers/index');


describe('generateRandomVerificationCode', () => {
    it('Should Return a 6-digit code', () => {
        const verificationcode = generateRandomVerificationCode();
        expect(verificationcode).to.be.at.least(100000)
        expect(verificationcode).to.be.at.most(999999)
    });

    it('Should Return a  Unique Verification Code EveryTime ', () => {
        const verificationcode_1 = generateRandomVerificationCode();
        const verificationcode_2 = generateRandomVerificationCode();
        expect(verificationcode_1).not.to.be.equal(verificationcode_2)
    });
    it('Should return a number', () => {
        const verificationcode = generateRandomVerificationCode();
        expect(verificationcode).to.be.a('number');
    });
});