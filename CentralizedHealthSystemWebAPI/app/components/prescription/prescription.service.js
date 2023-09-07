const PrescriptionDAL = require('./prescription.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');

class PrescriptionService {
    constructor() {
        this.prescriptionDAL = new PrescriptionDAL();
    }

    async createPrescription(userId, newPrescription) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        const currentDateTime = new Date();
        try {
            await dbClient.beginTransaction();
            const prescriptionId = await this.prescriptionDAL.insertPrescription(
                dbClient, userId, newPrescription, currentDateTime
            );
            await this.prescriptionDAL.insertPrescriptionMedicines(
                dbClient, prescriptionId, newPrescription.medicines
            );
            await dbClient.commit();
            return prescriptionId;
        } catch (error) {
            await dbClient.rollback();
            throw error;
        } finally {
            await dbClient.release();
        }
    }

    async deletePrescription(id, prescriptionId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const prescription = await this.prescriptionDAL.getPrescriptionById(dbClient, prescriptionId);
            if (!prescription) throw new Error('PRESCRIPTION_NOT_FOUND');
            if (prescription.doctorId !== id) throw new Error('DOCTOR_PERMISSION_DENIED');
            await dbClient.beginTransaction();
            await this.prescriptionDAL.deletePrescriptionMedicines(dbClient, prescriptionId);
            await this.prescriptionDAL.deletePrescription(dbClient, prescriptionId);
            await dbClient.commit();
        } catch (error) {
            await dbClient.rollback();
            throw error;
        } finally {
            dbClient.release();
        }
    }

    async updatePrescriptionDetails(id, prescriptionId, details, medicines) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        const currentDateTime = new Date();
        try {
            const prescription = await this.prescriptionDAL.getPrescriptionById(dbClient, prescriptionId);
            if (!prescription) throw new Error('PRESCRIPTION_NOT_FOUND');
            if (prescription.doctorId !== id) throw new Error('DOCTOR_PERMISSION_DENIED');
            await dbClient.beginTransaction();
            await this.prescriptionDAL.deletePrescriptionMedicines(dbClient, prescriptionId);
            await this.prescriptionDAL.updatePrescriptionDetails(dbClient, prescriptionId, currentDateTime, details);
            await this.prescriptionDAL.insertPrescriptionMedicines(dbClient, prescriptionId, medicines);
            await dbClient.commit();
        } catch (error) {
            await dbClient.rollback();
            throw error;
        } finally {
            dbClient.release();
        }
    }

    async getPrescriptionById(prescriptionId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const prescription = await this.prescriptionDAL.getPrescriptionById(dbClient, prescriptionId);
            if (!prescription) throw new Error("PRESCRIPTION_NOT_FOUND");
            const medicines = await this.prescriptionDAL.getPrescriptionMedicines(dbClient, prescriptionId);
            prescription.medicines = medicines;
            return prescription;
        } finally {
            dbClient.release();
        }
    }
}
module.exports = PrescriptionService