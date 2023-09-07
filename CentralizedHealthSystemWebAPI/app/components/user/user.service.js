const UserDAL = require('./user.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');
const { STATUS_NAME } = require('../../constants');
const { generateHashPassword, compareHashPassword, generateCryptoRandomString } = require('../../lib/crypto');
const { generateJwtWebToken } = require('../../helpers/jwt');
const { generateRandomVerificationCode } = require('../../helpers');
const { sendVerificationEmail, sendForgotPasswordEmail } = require('../../lib/nodeMailer');

const prepareUserHashPasswordAndSalt = (password) => {
    const { hashPassword, salt } = generateHashPassword(password);
    return {
        hashPassword,
        salt,
    };
}

class UserService {
    constructor() {
        this.userDAL = new UserDAL();
    }

    async createUser(newUser) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        const currentDateTime = new Date();
        const dob = new Date(newUser.dob);
        let statusId;
        try {
            const user = await this.userDAL.getUserByEmail(dbClient, newUser.email);
            if (user) throw new Error('EMAIL_IS_TAKEN');
            if (newUser.status) {
                statusId = await this.userDAL.getUserStatusIdByName(dbClient, newUser.status);
            } else {
                statusId = await this.userDAL.getUserStatusIdByName(dbClient, STATUS_NAME.PENDING);
            }
            const roleId = await this.userDAL.getRoleByName(dbClient, newUser.role);
            const { hashPassword, salt } = prepareUserHashPasswordAndSalt(newUser.password);
            newUser.isVerified = 0;
            newUser.verificationCode = generateRandomVerificationCode();
            newUser.statusId = statusId.id;
            newUser.password = hashPassword;
            newUser.salt = salt;
            newUser.dob = dob;
            await dbClient.beginTransaction();
            const documentId = await this.userDAL.addDocument(dbClient, newUser.documentData);
            newUser.documentId = documentId;
            const userId = await this.userDAL.insertUser(
                dbClient, newUser, currentDateTime,
            );
            await this.userDAL.insertUserRoleMapping(dbClient, userId, roleId.id);
            await dbClient.commit();
            await sendVerificationEmail(newUser);
            return userId;
        } catch (error) {
            await dbClient.rollback();
            throw error;
        } finally {
            await dbClient.release();
        }
    }

    async loginUser(email, password, keepUserLoggedIn = false) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const user = await this.userDAL.getUserByEmail(dbClient, email);
            if (!user || user.isDeleted) throw new Error('USER_NOT_FOUND');
            const hashPassword = compareHashPassword(password, user.salt);
            if (user.password !== hashPassword) throw new Error('INVALID_ACCESS_CREDENTIAL');
            const userDetails = await this.userDAL.getUserDetailsByID(dbClient, user.userId);
            if (!userDetails.isVerified || userDetails.statusName !== STATUS_NAME.APPROVED) {
                throw new Error('USER_NOT_VERIFIED');
            }
            const userRoleDetails = await this.userDAL.getUserRoleByUserId(dbClient, user.userId);
            const jwtToken = generateJwtWebToken(userDetails.userId, userRoleDetails.roleName, keepUserLoggedIn);
            return {
                userDetails: {
                    id: userDetails.userId,
                    name: userDetails.name,
                    email: userDetails.email,
                },
                jwtToken: "Bearer " + jwtToken,
            };
        } finally {
            dbClient.release();
        }
    }

    async filterUsers(status, role, name) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const usersDetails = await this.userDAL.filterUsers(dbClient, status, role, name);
            return usersDetails;
        } finally {
            dbClient.release();
        }
    }

    async getUserDetailById(userId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const userDetail = await this.userDAL.getUserById(dbClient, userId);
            return userDetail;
        } finally {
            dbClient.release();
        }
    }

    async softDeleteUserById(userId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const userDetails = await this.userDAL.getUserDetailsByID(dbClient, userId);
            if (!userDetails) throw new Error('USER_NOT_FOUND');
            await this.userDAL.softDeleteUserById(dbClient, userId);

        } finally {
            dbClient.release();
        }
    }

    async updateUserStatus(userId, status, remarks) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const statusId = await this.userDAL.getUserStatusIdByName(dbClient, status);
            await this.userDAL.updateUserStatus(dbClient, userId, statusId.id, remarks);
        } finally {
            dbClient.release();
        }
    }

    async verifyUser(verificationCode) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const user = await this.userDAL.getUserByVerificationCode(dbClient, verificationCode);
            if (!user) throw new Error('INVALID_VERIFICATION_CODE');
            await this.userDAL.updateUserVerificationStatus(dbClient, user.userId);
        } finally {
            dbClient.release();
        }
    }

    async forgotPassword(email) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const user = await this.userDAL.getUserByEmail(dbClient, email);
            if (!user) throw new Error('USER_NOT_FOUND');
            const updateDetail = {
                recoverToken: generateCryptoRandomString(),
                updatedAt: new Date().toISOString(),
            };
            const emailDetail = {
                name: user.name,
                email,
                recoverToken: updateDetail.recoverToken,
            };
            await this.userDAL.updateRecoverTokenById(dbClient, user.userId, updateDetail.recoverToken);
            await sendForgotPasswordEmail(emailDetail);
        } finally {
            dbClient.release();
        }
    }

    async resetPassword(token, password) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const user = await this.userDAL.getUserByRecoverToken(dbClient, token);
            if (!user) throw new Error('USER_NOT_FOUND');
            const { hashPassword, salt } = prepareUserHashPasswordAndSalt(password);
            const updateUserDetails = {
                password: hashPassword,
                salt: salt,
                recoverToken: null,
            };
            await this.userDAL.resetUserPassword(dbClient, user.userId, updateUserDetails);
        } finally {
            dbClient.release();
        }
    }
}

module.exports = UserService;
