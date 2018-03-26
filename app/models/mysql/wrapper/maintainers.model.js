"use strict";

const mysql = require('../../../db/db').mysql;


module.exports = {

    /**
     * @type async function
     * @access public
     * @description Get enabled maintainers email.
     * @returns {async}
     */
    async getEnabledMaintainersEmail() {
        const query = 'SELECT email FROM maintainers WHERE status="enabled"';

        try {
            return await mysql.getConnection().execute(query);
        } catch (err) {
            throw new Error(err);
        }
    }
};