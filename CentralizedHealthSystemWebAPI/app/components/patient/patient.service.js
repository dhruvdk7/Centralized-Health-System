const PatientDAL = require('./patient.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');

class PatientService {
    constructor() {
        this.patientDAL = new PatientDAL();
    }
    async getPatientDetailsById(patientId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const patientDetails = await this.patientDAL.getPatientDetailsById(dbClient, patientId)
            if (!patientDetails) throw new Error("PATIENT_NOT_FOUND");
            return patientDetails;
        } finally {
            dbClient.release();
        }
    }

    async getPatientPrescriptions(patientId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const patientDetails = await this.patientDAL.getPatientDetailsById(dbClient, patientId);
            if (!patientDetails) throw new Error("PATIENT_NOT_FOUND");
            const prescriptionDetails = await this.patientDAL.getPatientPrescriptionDetails(dbClient, patientId);
            return prescriptionDetails;
        } finally {
            dbClient.release();
        }
    }

    async updatePatientDetails(patientId, updateBody) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            await this.patientDAL.updatePatientDetails(dbClient, patientId, updateBody);
        } finally {
            dbClient.release();
        }
    }
}
module.exports = PatientService;