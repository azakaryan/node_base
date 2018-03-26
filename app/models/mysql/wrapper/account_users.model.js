"use strict";

const mysql = require('../../../db/db').mysql;

module.exports = {

    /**
     * @type async function
     * @access public
     * @param user_id
     * @description Get user accounts.
     * @returns {async}
     */
    async getUserAccounts(user_id) {
        const query = `
            SELECT account.domain_name, account.id FROM account_user 
            JOIN account ON account.id=account_user.account_id
            WHERE account_user.user_id=?
        `;

        try {
            const [row] = await mysql.getConnection().execute(query, [user_id]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param account_id
     * @param user_id
     * @description Find association for specified account and user.
     * @returns {async}
     */
    async find_association(account_id, user_id) {
        const query = "SELECT * FROM account_user WHERE account_id=? AND user_id=?";

        try {
            const [row] = await mysql.getConnection().execute(query, [account_id, user_id]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    }
};