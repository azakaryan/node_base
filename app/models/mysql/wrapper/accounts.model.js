"use strict";

const mysql = require('../../../db/db').mysql;

module.exports = {

    /**
     * @type async function
     * @access public
     * @description Return All Accounts.
     * @returns {async}
     */
    async getAll() {
        const query = "SELECT * FROM account";

        try {
            const [rows] = await mysql.getConnection().execute(query);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param name
     * @description Find account by domain name.
     * @returns {async}
     */
    async findByDomainName(name) {
        const query = "SELECT * FROM account WHERE domain_name=?";

        try {
            const [[row]] = await mysql.getConnection().execute(query, [name]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type async function
     * @access public
     * @param args
     * @description Create a new account.
     * @returns {async}
     */
    async createAccount(name, domain_name) {
        const query = "INSERT INTO account SET name=?, domain_name=?";

        try {
            const [row] = await mysql.getConnection().execute(query, [name, domain_name]);
            return row;
        } catch (err) {
            throw new Error(err);
        }
    },


    /**
     * @type async function
     * @access public
     * @param args
     * @description Delete profile by domain_name.
     * @returns {async}
     */
    async deleteByDomainName(domain_name) {
        const query = "DELETE from account where domain_name=?";

        try {
            const [rows] = await mysql.getConnection().execute(query, [domain_name]);
            return rows;
        } catch (err) {
            throw new Error(err);
        }
    },
};