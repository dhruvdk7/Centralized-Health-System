const PharmacyService = require('./pharmacy.service');
class PharmacyController {
    constructor() {
        this.PharmacyService = new PharmacyService();
    }
    async getPrescriptionById(request, response, next) {
        try {
            const { userId } = request.params;
            const prescriptionDetail = await this.PharmacyService.getPrescriptionById(userId);
            response.status(200).json(prescriptionDetail);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new PharmacyController();