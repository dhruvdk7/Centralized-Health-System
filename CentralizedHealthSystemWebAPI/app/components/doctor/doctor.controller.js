const DoctorService = require('./doctor.service');
const { decodeJwtToken } = require('../../helpers/jwt');

class DoctorController {
    constructor() {
        this.doctorService = new DoctorService();
    }

    async filterPatient(request, response, next) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const { id } = await decodeJwtToken(token);
            const filterRequest = request.body;
            const patientsDetails = await this.doctorService.filterPatient(filterRequest, id);
            response.status(200).json(patientsDetails);
        } catch (error) {
            next(error);
        }
    }

    async sendSignupUserMail(request, response, next) {
        try {
            await this.doctorService.sendSignupUserMail(request.body);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

    async getPatientDetails(request, response, next) {
        try {
            const { patientId } = request.params;
            const patientDetails = await this.doctorService.getPatientDetails(patientId);
            response.status(200).json(patientDetails);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DoctorController();
