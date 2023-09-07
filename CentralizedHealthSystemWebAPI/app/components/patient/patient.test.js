const chai = require("chai");
const sinon = require('sinon');
const chaiHttp = require("chai-http");
const { describe } = require("mocha");

const server = require("../../../test");
const PatientDAL = require('./patient.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');
const { testJwtToken } = require('../../config');

chai.should();
chai.use(chaiHttp);

const authHeaders = {
    Authorization: testJwtToken,
    'Content-Type': 'application/json'
};

const validupdatePatientApiReqBody = {
    name: "Yash",
    address: "test Address",
};
const invalidupdatePatientApiReqBody = {
    name: "Yash",
    address: "test Address",
    phonenumber: "Yash Updated"
};

describe('Patient APIS', () => {
    let getPatientDetailsByIdStub;
    before(() => {
        sinon.stub(mySqlDbHelper, 'dbConnPool').value({
            promise: () => ({
                getConnection: sinon.stub().resolves({
                    release: sinon.spy()
                })
            })
        });
        getPatientDetailsByIdStub = sinon.stub(PatientDAL.prototype, 'getPatientDetailsById');
        const getPatientDetailsByIdRes = {
            patientName: "Test user",
            patientEmail: "test@dal.ca",
            phonenumber: 1234567890,
            bloodGroup: "B+",
            address: "Test remarks",
            DOB: null,
            patientId: 12,
            document: null,
        };
        getPatientDetailsByIdStub.resolves(getPatientDetailsByIdRes);
    });

    after(() => {
        sinon.restore();
        getPatientDetailsByIdStub.restore();
    });

    describe('GET /patient/:patientId', () => {
        it('Should Return Patient Details', () => {
            return chai.request(server)
                .get('/patient/12')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                });
        });
        it('Should Give Error if the patient is unauthorized', () => {
            return chai.request(server)
                .get('/patient/12')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });

    describe('PUT /patient/:patientId', () => {
        it('Should Update the Patient Details', () => {
            const updatePatientDetailsStub = sinon.stub(PatientDAL.prototype, 'updatePatientDetails');
            const updatePatientDetailsRes = {
                patientName: "Test user",
                patientEmail: "test@dal.ca",
                phonenumber: 1234567890,
                bloodGroup: "B+",
                address: "Test remarks",
                DOB: null,
                patientId: 12,
                document: null,
            };
            updatePatientDetailsStub.resolves(updatePatientDetailsRes);
            return chai.request(server)
                .put('/patient/12')
                .set(authHeaders)
                .send(validupdatePatientApiReqBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                    updatePatientDetailsStub.restore();
                });
        });
        it('Request body is not valid for Update', () => chai.request(server)
            .put('/patient/12')
            .set(authHeaders)
            .send(invalidupdatePatientApiReqBody)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
        it('Should Give Error if the patient is unauthorized', () => chai.request(server)
            .put('/patient/12')
            .send(validupdatePatientApiReqBody)
            .then((res) => {
                chai.expect(res.status).to.be.equal(401);
            }));
    });
    describe('Get /patient/:patientId/prescriptions', () => {
        it('Should Return the  Patient Prescription Details', () => {
            const getPatientPrescriptionDetailsStub = sinon.stub(PatientDAL.prototype, 'getPatientPrescriptionDetails');
            const getPatientPrescriptionDetailsRes = {
                prescriptionId: 12,
                doctorId: 2,
                doctorName: "Test",
                details: "B+",
                createdAt: null,
                updatedAt: null,
            };
            getPatientPrescriptionDetailsStub.resolves(getPatientPrescriptionDetailsRes);
            return chai.request(server)
                .get('/patient/12/prescriptions')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    getPatientPrescriptionDetailsStub.restore();
                });
        });
        it('Should Give Error if the patient is unauthorized', () => chai.request(server)
            .get('/patient/12/prescriptions')
            .then((res) => {
                chai.expect(res.status).to.be.equal(401);
            }));
    });
});