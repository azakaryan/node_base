"use strict";

const validator = require('one-validation');
const expectedUserArguments = ["email", "password"];

module.exports = {

    /**
     * @type async function
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Check arguments for create user.
     * @returns {async}
     */
    async validatePostUserArgs(req, res, next) {
        const missingArgs = expectedUserArguments.filter((key) => !req.body[key]);

        // Validate Args Existence
        if (missingArgs.length)
            throw {code: "MISSING_ARGUMENTS", args: {missing: missingArgs.join(", ")}};

        // Validate Email
        const email = req.body.email;
        if (!validator.email.test(email))
            throw {code: "INVALID_ARGUMENTS", args: {invalid: `email ${email}`}};

        // If Arguments Are Valid, Carry On
        return next();
    },

    /**
     * @type async function
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Validate User Activation Key Existence.
     * @returns {async}
     */
    async validateUserActivationKeyExistence(req, res, next) {
        const key = req.query.key;

        // Validate Args Existence
        if (!key)
            throw {code: "MISSING_ARGUMENTS", args: {missing: "key"}};

        // If Key Exists, Carry On
        return next();
    },

    /** TODO
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Check whether the user is Authorised to access the data.
     * @returns {async}
     */
    async isAuthorised(req, res, next) {
        // If Arguments Are Valid, Carry On
        return next();
    }
};