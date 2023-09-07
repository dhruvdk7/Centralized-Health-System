const PharmacyDAL = require('./pharmacy.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');

class PharmacyService {
    constructor() {
        this.pharmacyDAL = new PharmacyDAL();
    }

    async getPrescriptionById(userId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const userDetails = await this.pharmacyDAL.getUserDetails(dbClient, userId)
            if (!userDetails) {
                const userDetails = await this.pharmacyDAL.getUserDetailsWithoutPrescription(dbClient, userId);
                userDetails.prescriptionDetails = [];
                return userDetails
            } else {
                const prescriptionDetails = await this.pharmacyDAL.getPrescriptionDetails(dbClient, userDetails.patientId);
                userDetails.prescriptionDetails = prescriptionDetails;
            }
            return userDetails;
        } finally {
            dbClient.release();
        }
    }
}
module.exports = PharmacyService;
