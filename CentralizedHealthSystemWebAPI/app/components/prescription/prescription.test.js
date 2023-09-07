const chai = require("chai");
const sinon = require('sinon');
const chaiHttp = require("chai-http");
const { describe } = require("mocha");
const mySqlDbHelper = require('../../db/mySqlDbHelper');
const server = require("../../../test");
const PrescriptionDAL = require('./prescription.dal');
const { testJwtToken } = require('../../config');

chai.should();
chai.use(chaiHttp);

const authHeaders = {
    Authorization: testJwtToken,
    'Content-Type': 'application/json'
};

const valid_createPrescriptionReq = {
    patientId: 15,
    details: "Testing",
    medicines: [{
            medicineName: "medicine1",
            medicineQuantity: 2,
            note: "Test Note"
        },
        {
            medicineName: "medicine2",
            medicineQuantity: 5
        }
    ]
}

const validUpdateRequestBody = {
    details: "details",
    medicines: [{
        medicineName: "med111",
        medicineQuantity: 1,
        note: "This is note"
    }]
}
const invalidUpdateRequestBody = {
    details: "details",
    medicines: [{
        medicineName: "med111",
        medicineQuantity: "threetwo",
        note: "This is note"
    }]
}

const invalidCreatePrescriptionReq = {
    patientId: "ssssss",
    details: "Testing",
    medicines: [{
        medicineName: "medicine1",
        medicineQuantity: 2,
        note: "Test Note"
    }]
}

before(async() => {});


describe('Prescription API', () => {
    let getPrescriptionByIdStub;
    let deletePrescriptionMedicinesStub;
    let deletePrescriptionStub;
    let getPrescriptionMedicinesStub;
    let updatePrescriptionDetailsStub;
    let insertPrescriptionMedicinesStub;
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

        getPrescriptionByIdStub = sinon.stub(PrescriptionDAL.prototype, 'getPrescriptionById');
        const getPrescriptionByIdRes = {
            id: 2,
            doctorId: 12,
            doctorName: "Test Doctor",
            details: "Test Details",
            createdAt: null,
            updatedAt: null,
        };
        getPrescriptionByIdStub.resolves(getPrescriptionByIdRes);

        deletePrescriptionMedicinesStub = sinon.stub(PrescriptionDAL.prototype, 'deletePrescriptionMedicines');
        deletePrescriptionMedicinesStub.resolves();

        deletePrescriptionStub = sinon.stub(PrescriptionDAL.prototype, 'deletePrescription');
        deletePrescriptionStub.resolves();

        getPrescriptionMedicinesStub = sinon.stub(PrescriptionDAL.prototype, 'getPrescriptionMedicines');
        const getPrescriptionMedicinesRes = {
            medicineId: 1,
            medicineName: "Test Medicine",
            medicineQuantity: 4,
            note: "Test Note"
        };
        getPrescriptionMedicinesStub.resolves(getPrescriptionMedicinesRes);

        insertPrescriptionMedicinesStub = sinon.stub(PrescriptionDAL.prototype, 'insertPrescriptionMedicines');
        const insertPrescriptionMedicinesRes = {};
        insertPrescriptionMedicinesStub.resolves(insertPrescriptionMedicinesRes);

        updatePrescriptionDetailsStub = sinon.stub(PrescriptionDAL.prototype, 'updatePrescriptionDetails');
        updatePrescriptionDetailsStub.resolves();
    });


    after(() => {
        sinon.restore();
        getPrescriptionByIdStub.restore();
        deletePrescriptionMedicinesStub.restore();
        getPrescriptionMedicinesStub.restore();
        insertPrescriptionMedicinesStub.restore();
        deletePrescriptionStub.restore();
        updatePrescriptionDetailsStub.restore();

    });

    describe('GET /prescriptions/:prescriptionId', () => {
        it('Should Return Prescription Details ', () => {
            return chai.request(server)
                .get('/prescriptions/14')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                });
        });

        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .get('/prescriptions/14')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });

    describe('POST /prescriptions/:prescriptionId', () => {
        it('Should Create The Prescriptions ', () => {
            const insertPrescriptionStub = sinon.stub(PrescriptionDAL.prototype, 'insertPrescription');
            const insertPrescriptionRes = {
                "prescriptionId": 68
            };
            insertPrescriptionStub.resolves(insertPrescriptionRes);

            return chai.request(server)
                .post('/prescriptions')
                .set(authHeaders)
                .send(valid_createPrescriptionReq)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(200);
                    insertPrescriptionStub.restore();
                });
        });

        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .post('/prescriptions')
                .set({})
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
        it('Should Give Error if Request Body is Not Valid', () => chai.request(server)
            .post('/prescriptions')
            .set(authHeaders)
            .send(invalidCreatePrescriptionReq)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
    });

    describe('Delete /prescriptions/:prescriptionId', () => {
        it('Should Delete  The Prescriptions ', () => {
            return chai.request(server)
                .delete('/prescriptions/14')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                });
        });
        it('Cannot delete if the Prescription does not exist ', () => {
            return chai.request(server)
                .delete('/prescriptions/14')
                .set(authHeaders)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                });
        });

        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .delete('/prescriptions/14')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
        it('Request body is not valid for Create Prescription', () => chai.request(server)
            .delete('/prescriptions/nfsdoao')
            .set(authHeaders)
            .then((res) => {
                chai.expect(res.status).to.be.equal(400);
            }));
    });


    describe('PUT /prescriptions/:prescriptionId', () => {
        it('Should Update The Prescriptions ', () => {
            return chai.request(server)
                .put('/prescriptions/14')
                .set(authHeaders)
                .send(validUpdateRequestBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(204);
                });
        });

        it('Should Give Error if the Request Body is Invalid ', () => {
            return chai.request(server)
                .put('/prescriptions/14')
                .set(authHeaders)
                .send(invalidUpdateRequestBody)
                .then((res) => {
                    chai.expect(res.status).to.be.equal(400);
                });
        });
        it('Should Give Error if Authorization is Not Proper', () => {
            return chai.request(server)
                .put('/prescriptions/14')
                .then((res) => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
    });
});