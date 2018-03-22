"use strict";

const bCrypt = require("bcrypt-nodejs");

module.exports = {

    /**
     * @type function
     * @access public
     * @param hashPassword
     * @param password
     * @description Compares hash passwords.
     * @returns {*}
     */
    isValidPassword(hashPassword, password) {
        bCrypt.compareSync(password, hashPassword);
    },

    /**
     * @type function
     * @access public
     * @param password
     * @description Creates hash password from given string.
     * @returns {*}
     */
    createHash(password) {
        bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
};