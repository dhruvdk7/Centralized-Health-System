const Joi = require('joi');

const validationSchema = {
    searchId: Joi.number().min(1),
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    patientId: Joi.number().min(1).required(),
    myPatient: Joi.boolean().default(false),
    searchName: Joi.string().min(1),
};

module.exports = {
    filterPatient: {
        body: Joi.object({
            searchId: validationSchema.searchId,
            myPatient: validationSchema.myPatient,
        })
    },
    getPatientDetails: {
        params: Joi.object({
            patientId: validationSchema.patientId,
        })
    },
    sendSignupUserMail: {
        body: Joi.object({
            name: validationSchema.name,
            email: validationSchema.email,
        })
    }
};
