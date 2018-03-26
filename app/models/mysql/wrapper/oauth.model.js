"use strict";

const mysql = require('../../../db/db').mysql;

module.exports = {

    /**
     * @type async function
     * @access public
     * @param access_token
     * @description Get user id by access token. For Testing Porpuses.
     * @returns {async}
     */
    async getUserIdByToken(access_token) {
        const query = "SELECT user_id FROM oauth_access_token WHERE access_token=?";

        try {
            const [row] = await mysql.getConnection().execute(query, [access_token]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    }
};