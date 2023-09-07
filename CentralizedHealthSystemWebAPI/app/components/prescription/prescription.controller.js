const PrescriptionService = require('./prescription.service');
const { decodeJwtToken } = require('../../helpers/jwt');
class PrescriptionController {
    constructor() {
        this.prescriptionService = new PrescriptionService();
    }

    async createPrescription(request, response, next) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const { id } = await decodeJwtToken(token);
            const prescription = request.body;
            const prescriptionId = await this.prescriptionService.createPrescription(id, prescription);
            response.status(200).json({ prescriptionId });
        } catch (error) {
            next(error);
        }
    }

    async deletePrescription(request, response, next) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const { id } = await decodeJwtToken(token);
            const { prescriptionId } = request.params;
            await this.prescriptionService.deletePrescription(id, prescriptionId);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

    async updatePrescriptionDetails(request, response, next) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const { id } = await decodeJwtToken(token);
            const { prescriptionId } = request.params;
            const { details, medicines } = request.body;
            await this.prescriptionService.updatePrescriptionDetails(id, prescriptionId, details, medicines);
            response.status(204).json();
        } catch (error) {
            next(error);
        }
    }

    async getPrescriptionById(request, response, next) {
        try {
            const { prescriptionId } = request.params;
            const prescriptionDetail = await this.prescriptionService.getPrescriptionById(prescriptionId);
            response.status(200).json(prescriptionDetail);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new PrescriptionController();
