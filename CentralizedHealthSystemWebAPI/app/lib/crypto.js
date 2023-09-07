const crypto = require('crypto');

const generateRandomString = (len) => {
    return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};

const passHash = (password, salt) => {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash;
};

const generateHashPassword = (userPassword) => {
    const salt = generateRandomString(32);
    const hashPassword = passHash(userPassword, salt);
    return {
        hashPassword,
        salt,
    };
}

const compareHashPassword = (userPassword, salt) => {
    const hashPassword = passHash(userPassword, salt);
    return hashPassword;
}

const generateCryptoRandomString = () => {
    const buffer = crypto.randomBytes(48);
    const randomString = buffer.toString('hex');
    return randomString;
}

module.exports = { generateHashPassword, compareHashPassword, generateCryptoRandomString };