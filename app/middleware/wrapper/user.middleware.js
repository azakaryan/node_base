"use strict";

const validator = require('one-validation');
const expectedUserArguments = ["email", "password"];
const errorHandler = require('../../util/').ResponseHandler;  // TODO modify ResponseHandler to errorHandler

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
            return res.status(400).json( errorHandler.handleError( {code: "MISSING_ARGUMENTS", args: {missing: missingArgs.join(", ")}} ) );

        // Validate Email
        const email = req.body.email;
        if (!validator.email.test(email))
            return res.status(400).json( errorHandler.handleError( {code: "INVALID_ARGUMENTS", args: {invalid: `email ${email}`}} ) );

        // If Arguments Are Valid, Carry On
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