module.exports = {
    NOT_FOUND: {
        httpStatusCode: 404,
        body: {
            code: 'not_found',
            message: 'You lost somewhere. Please check url again.',
        },
    },
    INTERNAL_SERVER_ERROR: {
        httpStatusCode: 500,
        body: {
            code: 'internal_server_error',
            message: 'Something went wrong, please try again later.',
        },
    },
    INVALID_STATUS_NAME: {
        httpStatusCode: 400,
        body: {
            code: 'invalid_status_name',
            message: 'Status name is invalid.',
        }
    },
    EMAIL_IS_TAKEN: {
        httpStatusCode: 409,
        body: {
            code: 'email_is_taken',
            message: 'Email is taken. Try another.',
        },
    },
    USER_NOT_FOUND: {
        httpStatusCode: 404,
        body: {
            code: 'user_not_found',
            message: 'User not found.',
        },
    },
    INVALID_ACCESS_CREDENTIAL: {
        httpStatusCode: 401,
        body: {
            code: 'invalid_access_credential',
            message: 'The email or password you entered is incorrect',
        },
    },
    PERMISSION_DENIED: {
        httpStatusCode: 403,
        body: {
            code: 'permission_denied',
            message: 'Permission denied.',
        },
    },
    USER_NOT_VERIFIED: {
        httpStatusCode: 401,
        body: {
            code: 'user_not_verified',
            message: 'User is not verified.'
        }
    },
    INVALID_VERIFICATION_CODE: {
        httpStatusCode: 400,
        body: {
            code: 'invalid_verification_code',
            message: 'Verification code is not valid.'
        }
    },
    DOCTOR_PERMISSION_DENIED: {
        httpStatusCode: 403,
        body: {
            code: 'permission_denied',
            message: 'This doctor does not have authority',
        },
    },
    PERMISSION_DENIED_FOR_DOCTOR: {
        httpStatusCode: 403,
        body: {
            code: 'permission_denied',
            message: 'This doctor is not allowed to create his own prescription',
        },
    },
    PRESCRIPTION_NOT_FOUND: {
        httpStatusCode: 404,
        body: {
            code: 'prescription_not_found',
            message: 'Prescription Not Found',
        },

    },
    PATIENT_NOT_FOUND: {
        httpStatusCode: 404,
        body: {
            code: 'patient_not_found',
            message: 'Patient not found.',
        },
    }
};
