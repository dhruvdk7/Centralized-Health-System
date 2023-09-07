const DoctorDAL = require('./doctor.dal');
const UserDAL = require('../user/user.dal');
const mySqlDbHelper = require('../../db/mySqlDbHelper');

const { UserRole } = require('../../constants/index');
const { sendSignupUserMail } = require("../../lib/nodeMailer");

class DoctorService {
    constructor() {
        this.doctorDAL = new DoctorDAL();
        this.userDAL = new UserDAL();
    }

    async filterPatient(filterRequest, userId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const patientsDetails = await this.doctorDAL.filterPatient(dbClient, filterRequest, UserRole.PATIENT, userId);
            return patientsDetails;
        } finally {
            dbClient.release();
        }
    }

    async sendSignupUserMail(newUser) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const user = await this.userDAL.getUserByEmail(dbClient, newUser.email);
            if (user) throw new Error('EMAIL_IS_TAKEN');
            await sendSignupUserMail(newUser.name, newUser.email);
        } finally {
            dbClient.release();
        }
    }

    async getPatientDetails(patientId) {
        const dbClient = await mySqlDbHelper.dbConnPool.promise().getConnection();
        try {
            const patientDetails = await this.doctorDAL.getPatientDetailsById(dbClient, patientId, UserRole.PATIENT);
            if (!patientDetails) throw new Error('PATIENT_NOT_FOUND');
            const patientPrescriptionDetails = await this.doctorDAL.getPatientPrescriptionDetails(dbClient, patientId);
            patientDetails.prescriptions = patientPrescriptionDetails;
            return patientDetails;
        } finally {
            dbClient.release();
        }
    }
}

module.exports = DoctorService;
