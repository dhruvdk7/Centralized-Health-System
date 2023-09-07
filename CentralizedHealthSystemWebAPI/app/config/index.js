require('dotenv-safe').config({ path: './.config/.env', allowEmptyValues: false });

module.exports = {
    jwtConfig: {
        secretKey: process.env.JWT_SECRET_KEY,
        timeoutWithRememberedMe: process.env.TIMEOUT_WITH_REMEMBERED_ME,
        timeoutWithoutRememberedMe: process.env.TIMEOUT_WITHOUT_REMEMBERED_ME,
    },
    nodeMailerConfig: {
        email: process.env.NODE_MAILER_EMAIL,
        password: process.env.NODE_MAILER_APP_PASSWORD,
    },
    chsClientUrl: process.env.CHS_CLIENT_URL,
    testJwtToken: process.env.TEST_JWT_AUTHTOKEN,
};
