"use strict";

const accountUsersModel = require('../../models/').MySQL.AccountUsers;

module.exports = {

    /**
     * @access public
     * @param req
     * @param res
     * @param next
     * @description Make sure the user is Admin for the Account.
     * @returns {async}
     */
    async isDomainAdmin(req, res, next) {
        const user_id = req.oauth.bearerToken.user_id,
            account_id = req.query.accountId || req.body.accountId || req.params.accountId || res.locals.accountId;

        if (!account_id || !user_id)
            throw {code: "MISSING_ARGUMENTS", args: {missing: `${user_id ? "" : "user_id, "}${account_id ? "" : "account_id"}`}};

        const association = await accountUsersModel.find_association(account_id, user_id);

        // TODO should be refactored to handle roles generally
        if (!association.length || association[0].role === 'READ_ONLY')
            throw {code: "FORBIDDEN"};

        return next();
    }
};