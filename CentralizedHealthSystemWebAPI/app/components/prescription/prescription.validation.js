const Joi = require('joi');

const validationSchema = {
    id: Joi.number().min(1).required(),
    patientId: Joi.number().min(1).required(),
    doctorId: Joi.number().min(1).required(),
    prescriptionDetails: Joi.string().required(),
    medicineName: Joi.string().required(),
    medicineQuantity: Joi.number().required(),
    medicineNote: Joi.string().required(),
    medicines: Joi.array().required().items({
        medicineName: Joi.string().required(),
        medicineQuantity: Joi.number().required(),
        note: Joi.string(),
    }).min(1),
};

module.exports = {
    createPrescription: {
        body: Joi.object({
            patientId: validationSchema.patientId,
            details: validationSchema.prescriptionDetails,
            medicines: validationSchema.medicines,
        }),
    },
    updatePrescription: {
        params: Joi.object({
            prescriptionId: validationSchema.id,
        }),
        body: Joi.object({
            details: validationSchema.prescriptionDetails,
            medicines: validationSchema.medicines,
        }),
    },
    getPrescriptionById: {
        params: Joi.object({
            prescriptionId: validationSchema.id,
        })
    },
    deletePrescriptionById: {
        params: Joi.object({
            prescriptionId: validationSchema.id,
        })
    }
};
