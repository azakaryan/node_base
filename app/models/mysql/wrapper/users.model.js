"use strict";

const mysql = require('../../../db/db').mysql;

module.exports = {

    /**
     * @type asunc function
     * @access public
     * @param user_id
     * @description Find the user by id.
     * @returns {async}
     */
    async findById(user_id) {
        const query = `
            SELECT user.*, profile.* FROM user
            LEFT JOIN profile ON profile.user_id=user.id
            WHERE user.id=?;
        `;

        try {
            const [[row]] = await mysql.getConnection().execute(query, [user_id]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param username
     * @description Find the user by username.
     * @returns {async}
     */
    async findByUsername(username) {
        const query = "SELECT * FROM user WHERE username=?";

        try {
            const [[row]] = await mysql.getConnection().execute(query, [username]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param username
     * @param password
     * @param type
     * @description Create a new user.
     * @returns {async}
     */
    async create(username, password, type) {
        const query = "INSERT INTO user SET username=?, password=?, type=?, create_date=now()";

        try {
            const [rows] = await mysql.getConnection().execute(query, [username, password, type]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param user_id
     * @description Activate the user.
     * @returns {async}
     */
    async activateUser(user_id) {
        const query = "UPDATE user SET verified=? WHERE id=?";

        try {
            const [rows] = await mysql.getConnection().execute(query, [true, user_id]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    }
};