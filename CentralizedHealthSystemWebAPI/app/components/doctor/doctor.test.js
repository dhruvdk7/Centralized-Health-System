const chai = require("chai");
const sinon = require('sinon');
const chaiHttp = require("chai-http");
const { describe } = require("mocha");

const server = require("../../../test");
const DoctorDAL = require('./doctor.dal');
const UserDAL = require('../user/user.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');
const { testJwtToken } = require('../../config');
const nodemailer = require('nodemailer');

chai.should();
chai.use(chaiHttp);

const authHeaders = {
    Authorization: testJwtToken,
    'Content-Type': 'application/json'
};

const validFilterApiReqBody = {
    searchId: 1
};

const inValidFilterApiReqBody = {
    name: "Test"
};

const validCreateUserReqBody = {
    name: "Test User",
    email: "test@dal.ca"
};

const inValidCreateUserReqBody = {
    email: "Test User",
    name: "test@dal.ca"
};


describe('Doctor APIS', () => {

    before(() => {
        sinon.stub(mySqlDbHelper, 'dbConnPool').value({
            promise: () => ({
                getConnection: sinon.stub().resolves({
                    release: sinon.spy()
                })
            })
        });
        sinon.stub(nodemailer, 'createTransport').returns({
            sendMail: sinon.stub().resolves()
        });
    });

    after(() => {
        sinon.restore();
    });

    describe('POST /doctor/filter', () => {
        it('Should return list of user list', () => {
            const filterPatientStub = sinon.stub(DoctorDAL.prototype, 'filterPatient');
            const filterPatientRes = {
                userId: 1,
                name: "Test user",
                email: "test@dal.ca",
                number: 1234567890,
                qrcode: null,
                remarks: "Test remarks",
                updatedAt: null,
                createdAt: null,
                updatedBy: null,
                bloodGroup: "B+",
                dob: null,
            };
            filterPatientStub.resolves(filterPatientRes);

            return chai.request(server)
                .post('/doctor/filter')
                .set(authHeaders)
                .send(validFilterApiReqBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    filterPatientStub.restore();
                });
        });
        it('Request body is not valid', () => chai.request(server)
            .post('/doctor/filter')
            .set(authHeaders)
            .send(inValidFilterApiReqBody)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
        it('Doctor is unauthorized', () => chai.request(server)
            .post('/doctor/filter')
            .send({})
            .then((res) => {
                chai.expect(res.status).to.be.equal(401);
            }));
    });

    describe('GET /doctor/:patientId', () => {
        it('Should return user with prescription list', () => {
            const getPatientDetailsByIdStub = sinon.stub(DoctorDAL.prototype, 'getPatientDetailsById');
            const getPatientDetailsByIdRes = {
                userId: 1,
                name: "Test user",
                email: "test@dal.ca",
                number: 1234567890,
                qrcode: null,
                remarks: "Test remarks",
                updatedAt: null,
                createdAt: null,
                updatedBy: null,
                bloodGroup: "B+",
                dob: null,
                address: "Test Address",
            };
            getPatientDetailsByIdStub.resolves(getPatientDetailsByIdRes);

            const getPatientPrescriptionDetailsStub = sinon.stub(DoctorDAL.prototype, 'getPatientPrescriptionDetails');
            const getPatientPrescriptionDetailsRes = [{
                prescriptionId: 1,
                doctorId: 1,
                doctorName: "Test doctor",
                details: "Test details",
                createdAt: null,
                updatedAt: null
            }];
            getPatientPrescriptionDetailsStub.resolves(getPatientPrescriptionDetailsRes);

            return chai.request(server)
                .get('/doctor/1')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    getPatientDetailsByIdStub.restore();
                    getPatientPrescriptionDetailsStub.restore();
                });
        });
        it('Doctor is unauthorized', () => chai.request(server)
            .get('/doctor/1')
            .then((res) => {
                chai.expect(res.status).to.be.equal(401);
            }));
    });

    describe('GET /doctor/create-user', () => {
        it('Should send sign up mail to user', () => {
            const getUserByEmailStub = sinon.stub(UserDAL.prototype, 'getUserByEmail');
            const getUserByEmailRes = undefined;
            getUserByEmailStub.resolves(getUserByEmailRes);

            return chai.request(server)
                .post('/doctor/create-user')
                .set(authHeaders)
                .send(validCreateUserReqBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                    getUserByEmailStub.restore();
                });
        });
        it('Should throw email is taken error if email is taken', () => {
            const getUserByEmailStub = sinon.stub(UserDAL.prototype, 'getUserByEmail');
            const getUserByEmailRes = {
                userId: 1
            };
            getUserByEmailStub.resolves(getUserByEmailRes);

            return chai.request(server)
                .post('/doctor/create-user')
                .set(authHeaders)
                .send(validCreateUserReqBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(409);
                    getUserByEmailStub.restore();
                });
        });
        it('Request body is not valid', () => chai.request(server)
            .post('/doctor/create-user')
            .set(authHeaders)
            .send(inValidCreateUserReqBody)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
        it('Should throw error if user is not authorized', () => chai.request(server)
            .post('/doctor/create-user')
            .send(inValidCreateUserReqBody)
            .then((res) => {
                chai.expect(res.status).to.be.equal(401);
            }));
    });
});
