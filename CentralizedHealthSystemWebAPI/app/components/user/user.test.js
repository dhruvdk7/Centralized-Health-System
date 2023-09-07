const chai = require("chai");
const sinon = require('sinon');
const chaiHttp = require("chai-http");
const { describe } = require("mocha");
const mySqlDbHelper = require('../../db/mySqlDbHelper');
const server = require("../../../test");
const UserDAL = require('./user.dal');
const { testJwtToken } = require('../../config');
const nodemailer = require('nodemailer');

chai.should();
chai.use(chaiHttp);

const authHeaders = {
    Authorization: testJwtToken,
    'Content-Type': 'application/json'
};

const validFilterUserReqBody = {
    "status": "APPROVED"
};
const invalidFilterUserReqBody = {
    "status": 1234
};

const validVerificationCode = {
    "verificationCode": "212345"
};

const invalidVerificationCode = {
    "verificationCode": "sssssssssss"
};

const validUserStatus = {
    status: "PENDING",
    remarks: "1234"
};

const InvalidUserStatus = {
    status: 12233,
    remarks: "1234"
};

const createUserRequestBody = {
    name: "Test9",
    email: "dhruvkothari080900@gmail.com",
    number: "1234567890",
    bloodGroup: "B+",
    address: "test address",
    password: "dhruv#123",
    status: "APPROVED",
    role: "ADMIN",
    dob: "2000-02-02T00:00:00.000Z",
    documentData: "document testing"
};

const validLoginBody = {
    email: "test@dal.ca",
    password: "test#123"
};

const inValidLoginBody = {
    email: "testdal.ca",
    password: "12345"
}

const validForgotPasswordReq = {
    email: "test@dal.ca"
}

const validResetPasswordReq = {
    token: "123456",
    password: "password"
}

describe('User APIS', () => {
    let getUserByVerificationCodeStub;
    let updateUserVerificationStatusStub;
    let getUserByEmailStub;
    let getUserStatusIdByNameStub;
    let getUserDetailsByIDStub;

    before(() => {
        sinon.stub(mySqlDbHelper, 'dbConnPool').value({
            promise: () => ({
                getConnection: sinon.stub().resolves({
                    beginTransaction: sinon.stub().resolves(),
                    commit: sinon.stub().resolves(),
                    rollback: sinon.stub().resolves(),
                    release: sinon.spy()
                })
            }),
        });
        sinon.stub(nodemailer, 'createTransport').returns({
            sendMail: sinon.stub().resolves()
        });

        getUserStatusIdByNameStub = sinon.stub(UserDAL.prototype, 'getUserStatusIdByName');
        const getUserStatusIdByNameRes = {
            id: 1,
        };
        getUserStatusIdByNameStub.resolves(getUserStatusIdByNameRes);


        getUserByVerificationCodeStub = sinon.stub(UserDAL.prototype, 'getUserByVerificationCode');
        const getUserByVerificationCodeRes = {
            name: "Test User",
            email: "test@dal.ca"
        }
        getUserByVerificationCodeStub.resolves(getUserByVerificationCodeRes);

        updateUserVerificationStatusStub = sinon.stub(UserDAL.prototype, 'updateUserVerificationStatus');
        updateUserVerificationStatusStub.resolves();

        getUserDetailsByIDStub = sinon.stub(UserDAL.prototype, 'getUserDetailsByID');
        const getUserDetailsByIdRes = {
            id: 12,
            email: "test@dal.ca",
            name: "Test user",
            number: "9924999221",
            qrcode: null,
            remarks: "Test Remakrs",
            updatedAt: null,
            createdAt: null,
            updatedBy: null,
            bloodGroup: "A+",
            address: "Test Address",
            isVerified: 1,
            statusName: "APPROVED",
            documentId: 1,
            file: null
        }
        getUserDetailsByIDStub.resolves(getUserDetailsByIdRes);
    });

    after(() => {
        getUserByVerificationCodeStub.restore();
        updateUserVerificationStatusStub.restore();
        getUserByEmailStub.restore();
        sinon.restore();
    });

    describe('POST /users', () => {
        it('Should Create the user', () => {
            getUserByEmailStub = sinon.stub(UserDAL.prototype, 'getUserByEmail');
            const getUserByEmailRes = undefined;
            getUserByEmailStub.resolves(getUserByEmailRes);

            const getRoleByNameStub = sinon.stub(UserDAL.prototype, 'getRoleByName');
            const getRoleByNameRes = {
                id: 11
            };
            getRoleByNameStub.resolves(getRoleByNameRes);

            const addDocumentStub = sinon.stub(UserDAL.prototype, 'addDocument');
            const addDocumentRes = 2;
            addDocumentStub.resolves(addDocumentRes);

            const insertUserStub = sinon.stub(UserDAL.prototype, 'insertUser');
            insertUserStub.resolves();


            const insertUserRoleMappingStub = sinon.stub(UserDAL.prototype, 'insertUserRoleMapping');
            insertUserRoleMappingStub.resolves();

            return chai.request(server)
                .post('/users')
                .send(createUserRequestBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    insertUserRoleMappingStub.restore();
                    addDocumentStub.restore();
                    insertUserStub.restore();
                    getRoleByNameStub.restore();
                    getUserByEmailStub.restore();
                });
        });
        it('Request body is not valid', () => chai.request(server)
            .post('/users')
            .send({})
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
    });

    describe('Post  users/login', () => {
        it('Should login the user', () => {
            const getUserByEmailStub = sinon.stub(UserDAL.prototype, 'getUserByEmail');
            const getUserByEmailRes = {
                userId: 1,
                name: "Test",
                password: "0cd7190e806144a59c566db13ff202b8d98a54c091a4090d2db99477c873798d4054c7d7ab5a61a0526c816c2398592bdf3a4e8a8d2cb7a0050e6c77d590a73c",
                salt: "test",
                isDeleted: 0
            };
            getUserByEmailStub.resolves(getUserByEmailRes);

            const getUserRoleByUserIdStub = sinon.stub(UserDAL.prototype, 'getUserRoleByUserId');
            const getUserRoleByUserIdRes = {
                id: 1,
                roleName: "ADMIN",

            };
            getUserRoleByUserIdStub.resolves(getUserRoleByUserIdRes);


            return chai.request(server)
                .post('/users/login')
                .send(validLoginBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    getUserByEmailStub.restore();
                    getUserRoleByUserIdStub.restore();
                });
        });
        it('Request body is not valid', () => chai.request(server)
            .post('/users/login')
            .send(inValidLoginBody)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));

    });

    describe('Post  users/filter', () => {
        it('Should filter the users depending on the role', () => {
            const filterUsersStub = sinon.stub(UserDAL.prototype, 'filterUsers');
            const filterUsersRes = {
                userId: 1,
                email: "test@dal.ca",
                name: "test",
                number: 9924999621,
                qrcode: null,
                remarks: "test remarks",
                updatedAt: null,
                createdAt: null,
                updatedBy: null,
                bloodGroup: "B+",
                dob: null,
                address: "test address",
                statusName: "Approved",
                roleName: "test"
            }
            filterUsersStub.resolves(filterUsersRes);

            return chai.request(server)
                .post('/users/filter')
                .set(authHeaders)
                .send(validFilterUserReqBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    filterUsersStub.restore();
                });
        });
        it('Should throw error if request body is not valid', () => chai.request(server)
            .post('/users/filter')
            .set(authHeaders)
            .send(invalidFilterUserReqBody)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .post('/users/filter')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });

    describe('PUT users/verify', () => {
        it('Should verify the User', () => {
            return chai.request(server)
                .put('/users/verify')
                .send(validVerificationCode)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                });
        });
        it('Should throw error if request body is not valid', () => chai.request(server)
            .put('/users/verify')
            .send(invalidVerificationCode)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
    });

    describe('Get users/:userId', () => {
        it('Should Get the Details of the User', () => {
            let getUserByIdStub;
            getUserByIdStub = sinon.stub(UserDAL.prototype, 'getUserById');
            const getUserByIdRes = {
                userId: 12,
                name: "Test user",
                email: "test@dal.ca",
                number: "9924999221",
                remarks: "Test Remakrs",
                updatedAt: null,
                createdAt: null,
                updatedBy: null,
                bloodGroup: "A+",
                dob: null,
                address: "Test Address",
                isVerified: 1,
                statusName: "APPROVED",
                roleName: "ADMIN",
                file: null
            }
            getUserByIdStub.resolves(getUserByIdRes);
            return chai.request(server)
                .get('/users/12')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    getUserByIdStub.restore();
                });
        });
        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .get('/users/12')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });

    describe('DELETE users/:userId', () => {
        it('Should Delete the User', () => {
            const softDeleteUserByIdStub = sinon.stub(UserDAL.prototype, 'softDeleteUserById');
            softDeleteUserByIdStub.resolves();

            return chai.request(server)
                .delete('/users/12')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                    softDeleteUserByIdStub.restore();
                });
        });
        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .delete('/users/12')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });

    describe('Update users/:userId', () => {
        it('Should Update the User Status', () => {
            let updateUserStatusStub;
            updateUserStatusStub = sinon.stub(UserDAL.prototype, 'updateUserStatus');
            updateUserStatusStub.resolves();
            return chai.request(server)
                .put('/users/71')
                .send(validUserStatus)
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                    updateUserStatusStub.restore();
                });
        });
        it('Should Give Error if Request Body Is Not Valid', () => {
            return chai.request(server)
                .put('/users/71')
                .set(authHeaders)
                .send(InvalidUserStatus)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(400);
                });
        });
        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .get('/users/12')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });

    describe('Update User Status users/:userId', () => {
        it('Should Update the User Status', () => {
            let updateUserStatusStub;
            updateUserStatusStub = sinon.stub(UserDAL.prototype, 'updateUserStatus');
            updateUserStatusStub.resolves();
            return chai.request(server)
                .put('/users/71')
                .send(validUserStatus)
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                    updateUserStatusStub.restore();
                });
        });
        it('Should Give Error if Request Body Is Not Valid', () => {
            return chai.request(server)
                .put('/users/71')
                .set(authHeaders)
                .send(InvalidUserStatus)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(400);
                });
        });
        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .get('/users/12')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });

    describe('POST users/forgot-password', () => {
        it('Should send verification email to user', () => {
            const getUserByEmailStub = sinon.stub(UserDAL.prototype, 'getUserByEmail');
            const getUserByEmailRes = {
                userId: 12,
                name: "Test user",
                email: "test@dal.ca",
                number: "9924999221",
                remarks: "Test Remakes",
                updatedAt: null,
                createdAt: null,
                updatedBy: null,
                bloodGroup: "A+",
                dob: null,
                address: "Test Address",
                isVerified: 1,
                statusName: "APPROVED",
                roleName: "ADMIN",
                file: null
            }
            getUserByEmailStub.resolves(getUserByEmailRes);

            const updateRecoverTokenByIdStub = sinon.stub(UserDAL.prototype, 'updateRecoverTokenById');
            updateRecoverTokenByIdStub.resolves();

            return chai.request(server)
                .post('/users/forgot-password')
                .send(validForgotPasswordReq)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                    getUserByEmailStub.restore();
                    updateRecoverTokenByIdStub.restore();
                });
        });
        it('Should send user not found error', () => {
            const getUserByEmailStub = sinon.stub(UserDAL.prototype, 'getUserByEmail');
            getUserByEmailStub.resolves();

            const updateRecoverTokenByIdStub = sinon.stub(UserDAL.prototype, 'updateRecoverTokenById');
            updateRecoverTokenByIdStub.resolves();

            return chai.request(server)
                .post('/users/forgot-password')
                .send(validForgotPasswordReq)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(404);
                    getUserByEmailStub.restore();
                    updateRecoverTokenByIdStub.restore();
                });
        });
        it('Should send validation error is request body is not valid', () => {
            return chai.request(server)
                .post('/users/forgot-password')
                .send({})
                .then((res) => {
                    chai.expect(res.status).to.be.equal(400);
                });
        });
    });

    describe('POST users/rest-password', () => {
        it('Should send reset password email to user', () => {
            const getUserByRecoverTokenStub = sinon.stub(UserDAL.prototype, 'getUserByRecoverToken');
            const getUserByRecoverTokenRes = {
                userId: 12
            }
            getUserByRecoverTokenStub.resolves(getUserByRecoverTokenRes);

            const resetUserPasswordStub = sinon.stub(UserDAL.prototype, 'resetUserPassword');
            resetUserPasswordStub.resolves();

            return chai.request(server)
                .post('/users/reset-password')
                .send(validResetPasswordReq)
                .then((res) => {
                    console.log(res)
                    chai.expect(res.status).to.be.equal(204);
                    getUserByRecoverTokenStub.restore();
                    resetUserPasswordStub.restore();
                });
        });
        it('Should send validation error is request body is not valid', () => {
            return chai.request(server)
                .post('/users/reset-password')
                .send({})
                .then((res) => {
                    chai.expect(res.status).to.be.equal(400);
                });
        });
    });
});
