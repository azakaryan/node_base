"use strict";

const errorHandler = require('../../util/').ResponseHandler;  // TODO modify ResponseHandler to errorHandler

module.exports = {

    /**
     * @type async function
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Validate password.
     * @returns {async}
     */
    async isValidPassword(req, res, next) {
        const password = req.body.password;

        const regEx = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        const isValidPassword = regEx.test(password);
        if (!isValidPassword)
            return res.status(400).json( errorHandler.handleError( {code: "INVALID_ARGUMENTS", args: {invalid: "Password is invalid."}} ) );

        // If Arguments Are Valid, Carry On
        return next();
    }
};