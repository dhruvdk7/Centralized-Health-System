const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('../docs/swaggerDef');

const userRoutes = require('./user/user.route');
const prescriptionRoutes = require('./prescription/prescription.route');
const doctorRoutes = require('./doctor/doctor.route');
const pharmacyRoutes = require('./pharmacy/pharmacy.route');
const patientRoutes = require('./patient/patient.route');

const router = express.Router();

const healthCheck = (request, response) => {
    response.status(200).send({
        status: true,
    });
};

router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
router.use('/users', userRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/doctor', doctorRoutes);
router.use('/pharmacy', pharmacyRoutes);
router.use('/patient', patientRoutes);

module.exports.router = router;
module.exports.healthCheck = healthCheck;