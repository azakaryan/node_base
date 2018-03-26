"use strict";

const mysql = require('../../../db/db').mysql;

module.exports = {

    /**
     * @type async function
     * @access public
     * @param user_id
     * @param _key
     * @description Create a new user_activation_key.
     * @returns {async}
     */
    async create(user_id, _key) {
        const query = "INSERT INTO user_activation_key (user_id, _key) VALUES (?, ?)";

        try {
            const [rows] = await mysql.getConnection().execute(query, [user_id, _key]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param user_id
     * @param _key
     * @description Update the key, or create if does not exist.
     * @returns {async}
     */
    async update(user_id, _key) {
        const query = "UPDATE user_activation_key SET _key=?, issued_date=now() WHERE user_id=?";

        try {
            const [rows] = await mysql.getConnection().execute(query, [_key, user_id]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param key
     * @description Get user id & mailer by activation key.
     * @returns {async}
     */
    async getUserIdAndEmailByActivationKey(key) {
        const query = "SELECT user.username, user.id FROM user JOIN user_activation_key ON user.id=user_activation_key.user_id WHERE _key=?";

        try {
            const [rows] = await mysql.getConnection().execute(query, [key]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param key
     * @description Get the user_activation_key.
     * @returns {async}
     */
    async getUserActivationKey(key) {
        const query = 'SELECT * FROM user_activation_key WHERE _key=?';

        try {
            const [[row]] = await mysql.getConnection().execute(query, [key]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    }
};