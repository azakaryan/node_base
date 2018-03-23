"use strict";

const validator = require('one-validation');
const expectedUserArguments = ["email", "password"];

module.exports = {

    /**
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Check arguments for create user.
     * @returns {async}
     */
    async validatePostUserArgs(req, res, next) {
        const missingArgs = expectedUserArguments.filter((key) => !req.body[key]);
        // validate args existence
        if (missingArgs.length)
            return res.status(400).json({
                statusCode: 400,
                errorCode: 'MissingRequiredBodyParameter',
                errorMessage: `Missing args: ${missingArgs}.`
            });

        // validate email
        const username = req.body.email;
        const emailValidation = validator.email.test(username);
        if (!emailValidation)
            return res.status(400).json(    {
                statusCode: 400,
                errorCode: 'InvalidInput',
                errorMessage: 'The `email` is not valid.'
            });

        // if arguments are valid, carry on
        return next();
    }
};