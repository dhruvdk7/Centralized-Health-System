const { request } = require('express');
const Joi = require('joi');

const { STATUS_NAME, UserRole } = require('../../constants');

const validStatusNames = Object.values(STATUS_NAME);

const validationSchema = {
    id: Joi.number().min(1).required(),
    name: Joi.string().min(3).max(100),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().regex(/^\d{10}$/),
    bloodGroup: Joi.string().min(2).max(5),
    address: Joi.string(),
    documentData: Joi.string().required(),
    status: Joi.string().valid(...validStatusNames)
}

module.exports = {
    getPatientDetailsById: {
        params: Joi.object({
            patientId: validationSchema.id,
        })
    },

    getPatientPrescriptions: {
        params: Joi.object({
            patientId: validationSchema.id,
        })
    },
    updatePatienDetails: {
        params: Joi.object({
            patientId: validationSchema.id,
        }),
        body: Joi.object({
            name: validationSchema.name,
            number: validationSchema.phoneNumber,
            bloodGroup: validationSchema.bloodGroup,
            address: validationSchema.address,
        }),
    },
}