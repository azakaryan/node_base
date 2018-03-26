"use strict";

const mysql = require('../../../db/db').mysql;

module.exports = {

    /**
     * @type async function
     * @access public
     * @param username
     * @param password
     * @param type
     * @description Create a profile.
     * @returns {async}
     */
    async create(user_id,) {
        const query = "INSERT INTO profile (user_id) VALUES (?)";

        try {
            const [rows] = await mysql.getConnection().execute(query, [user_id]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    },

};