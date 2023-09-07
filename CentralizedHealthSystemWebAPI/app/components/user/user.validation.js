const { request } = require('express');
const Joi = require('joi');

const { STATUS_NAME, UserRole } = require('../../constants');

const validStatusNames = Object.values(STATUS_NAME);
const validRoleNames = Object.values(UserRole);

const validationSchema = {
    id: Joi.number().min(1).required(),
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().regex(/^\d{10}$/).required(),
    bloodGroup: Joi.string().min(2).max(5).required(),
    address: Joi.string().required(),
    documentData: Joi.string().required(),
    status: Joi.string().valid(...validStatusNames),
    role: Joi.string().valid(...validRoleNames).required(),
    password: Joi.string().min(8).required(),
    requiredStatus: Joi.string().required().valid(...validStatusNames),
    remarks: Joi.string(),
    rememberMe: Joi.boolean().default(false),
    searchName: Joi.string().min(1),
    filterStatus: Joi.string().valid(...validStatusNames),
    filterRole: Joi.string().valid(...validRoleNames),
    verificationCode: Joi.string().min(6).max(6).required(),
    dob: Joi.date().max('now').iso(),
    token: Joi.string().max(200).required(),
};

module.exports = {
    createUser: {
        body: Joi.object({
            name: validationSchema.name,
            email: validationSchema.email,
            number: validationSchema.phoneNumber,
            bloodGroup: validationSchema.bloodGroup,
            address: validationSchema.address,
            password: validationSchema.password,
            status: validationSchema.status,
            role: validationSchema.role,
            dob: validationSchema.dob,
            documentData: validationSchema.documentData,
        }),
    },
    loginUser: {
        body: Joi.object({
            email: validationSchema.email,
            password: validationSchema.password,
            rememberMe: validationSchema.rememberMe,
        }),
    },
    filterUsers: {
        body: Joi.object({
            status: validationSchema.filterStatus,
            role: validationSchema.filterRole,
            name: validationSchema.searchName,
        }).or('status', 'role', 'name')
    },
    verifyUser: {
        body: Joi.object({
            verificationCode: validationSchema.verificationCode,
        })
    },
    forgotPassword: {
        body: Joi.object({
            email: validationSchema.email,
        })
    },
    resetPassword: {
        body: Joi.object({
            token: validationSchema.token,
            password: validationSchema.password,
        }),
    },
    updateUserStatus: {
        params: Joi.object({
            userId: validationSchema.id,
        }),
        body: Joi.object({
            status: validationSchema.requiredStatus,
            remarks: validationSchema.remarks,
        })
    },
    getUserDetailsById: {
        params: Joi.object({
            userId: validationSchema.id,
        })
    },
    softDeleteUserById: {
        params: Joi.object({
            userId: validationSchema.id,
        })
    },
};
