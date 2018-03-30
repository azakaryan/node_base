"use strict";

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

        // TODO, Use validation library not to it manually.
        const regEx = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        const isValidPassword = regEx.test(password);
        if (!isValidPassword)
            throw {code: "INVALID_ARGUMENTS", args: {invalid: "Password is invalid."}};

        return next();
    }
};