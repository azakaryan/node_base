"use strict";

const oneValidation = require('one-validation');
const expectedAccountArguments = ["name", "domain_name"];

module.exports = {

    /**
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Check the correctness of arguments for account creation.
     * @returns {async}
     */
    async validateCreateAccountArgs(req, res, next) {
        const missingArgs = expectedAccountArguments.filter((key) => !(req.body[key] || req.body[key] === 0) );

        // Validate Expected Args Existence.
        if (missingArgs.length)
            return res.status(400).json({
                statusCode: 400,
                errorCode: 'MissingRequiredBodyParameter',
                errorMessage: `Missing args: ${missingArgs}.`
            });

        // Validate Domain Name
        if (!oneValidation['domain'].test(req.body.domain_name))
            return res.status(400).json({
                statusCode: 400,
                errorCode: 'InvalidInput',
                errorMessage: 'The `domain_name` is not valid.'
            });

        return next();
    }
};