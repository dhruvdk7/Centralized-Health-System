const chai = require("chai");
const sinon = require('sinon');
const chaiHttp = require("chai-http");
const { describe } = require("mocha");

const server = require("../../../test");
const PharmacyDal = require('./pharmacy.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');
const { testJwtToken } = require('../../config')


chai.should();
chai.use(chaiHttp);

const authHeaders = {
    Authorization: testJwtToken,
    'Content-Type': 'application/json'
};


describe('Pharmacy APIS', () => {

    before(() => {
        sinon.stub(mySqlDbHelper, 'dbConnPool').value({
            promise: () => ({
                getConnection: sinon.stub().resolves({
                    release: sinon.spy()
                })
            })
        });
    });

    after(() => {
        sinon.restore();
    });
    describe('GET /pharmacy/prescription/:patientId', () => {
        it('Should Return last 3 Prescription for the Pharmacy', () => {
            let getUserDetailsStub
            let getPrescriptionDetailsStub;
            let getUserDetailsWithoutPrescriptionStub;
            getUserDetailsStub = sinon.stub(PharmacyDal.prototype, 'getUserDetails');
            const getUserDetailsRes = {
                name: "test",
                email: "test@dal.ca",
                number: "1234567890",
                bloodGroup: "B+",
                address: "Address",
                patientId: 15,
            };
            getUserDetailsStub.resolves(getUserDetailsRes);
            getUserDetailsWithoutPrescriptionStub = sinon.stub(PharmacyDal.prototype, 'getUserDetailsWithoutPrescription');
            const getUserDetailsWithoutPrescriptionRes = {
                name: "Test",
                email: "Test@dal.ca",
                number: "9924999662",
                bloodGroup: "B+",
                address: "Address"
            };
            getUserDetailsWithoutPrescriptionStub.resolves(getUserDetailsWithoutPrescriptionRes);

            getPrescriptionDetailsStub = sinon.stub(PharmacyDal.prototype, 'getPrescriptionDetails');
            const getPrescriptionDetailsRes = {
                prescriptionId: 2,
                doctorId: 3,
                doctorName: "Test Doctor",
                details: "Test Details",
                createdAt: null,
                updatedAt: null
            };
            getPrescriptionDetailsStub.resolves(getPrescriptionDetailsRes);


            return chai.request(server)
                .get('/pharmacy/prescription/14')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    getUserDetailsStub.restore();
                    getUserDetailsWithoutPrescriptionStub.restore();
                    getPrescriptionDetailsStub.restore();
                });
        });
        it('Should Give Error if Authorization is Not Proper', () => chai.request(server)
            .get('/pharmacy/prescription/14ssss')
            .then((res) => {
                chai.expect(res.status).to.be.equal(401);
            }));
    });
});