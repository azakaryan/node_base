"use strict";

const accountUsersModel = require('../../models/').MySQL.AccountUsers;

module.exports = {

    /**
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Make sure the user is associated with account.
     * @returns {async}
     */
    async isAssociated(req, res, next) {
        const user_id = req.oauth.bearerToken.user_id,
            account_id = req.query.accountId || req.body.accountId || req.params.accountId;

        const account_user_data = await accountUsersModel.find_association(account_id, user_id);

        if (!account_user_data.length)
            throw {code: "FORBIDDEN"};

        return next();
    }
};