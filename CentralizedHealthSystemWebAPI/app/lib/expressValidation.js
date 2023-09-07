const expressValidation = require('express-validation');

class ExpressValidation {
    constructor() {
        this.ValidationError = expressValidation.ValidationError;
    }

    validate(schema) {
        return expressValidation.validate(schema, {}, { abortEarly: false });
    }
}

module.exports = new ExpressValidation();
