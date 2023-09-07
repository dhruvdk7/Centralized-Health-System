const PatientService = require('./patient.service');
const { decodeJwtToken } = require('../../helpers/jwt');


class PatientController {
    constructor() {
        this.patientService = new PatientService();
    }
    async getPatientDetailsById(request, response, next) {
        try {
            const { patientId } = request.params;
            const patientDetail = await this.patientService.getPatientDetailsById(patientId);
            response.status(200).json(patientDetail);
        } catch (error) {
            next(error);
        }
    }

    async getPatientPrescriptions(request, response, next) {
        try {
            const { patientId } = request.params;
            const prescriptionDetails = await this.patientService.getPatientPrescriptions(patientId);
            response.status(200).json(prescriptionDetails);
        } catch (error) {
            next(error);
        }
    }

    async updatePatientDetails(request, response, next) {
        try {
            const { patientId } = request.params;
            const updateBody = request.body;
            await this.patientService.updatePatientDetails(patientId, updateBody)
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

}
module.exports = new PatientController();