"use strict";

const accountsModel = require('../../models/').MySQL.Accounts;


module.exports = {

    /**
     * @type async function
     * @access public
     * @description Return All Account.
     * @returns {async}
     */
    async getAllAccounts() {
        try {
            return await accountsModel.getAll();
        } catch (e) {
            throw e;
        }
    },

    /**
     * @type async function
     * @access public
     * @param domain_name
     * @description Find account by domain name.
     * @returns {async}
     */
    async findByDomainName(domain_name) {
        try {
            const account = await accountsModel.findByDomainName(domain_name);
            if (!account)
                throw new Error('ACCOUNT_NOT_FOUND');

            return account;
        } catch (e) {
            throw e;
        }
    },

    /**
     * @type async function
     * @access public
     * @param args
     * @description (wrapper) Create account and // +  TODO sync with the user.
     * @returns {async}
     */
    async createAccount(user_id, args) {
        try {
            return await accountsModel.createAccount(args.name, args.domain_name);

            // TODO Should sync with User As well.
        } catch (e) {
            throw e;
        }
    }
};