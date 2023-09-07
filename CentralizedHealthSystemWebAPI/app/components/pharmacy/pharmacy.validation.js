const Joi = require('joi');

const validationSchema = {
    id: Joi.number().min(1).required(),
};

module.exports = {
    getPrescriptionDetailsById: {
        params: Joi.object({
            userId: validationSchema.id,
        })
    },
};
