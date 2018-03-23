"use strict";

const util = require('../../util/'),
    responseHandler = util.ResponseHandler;

const mysqlModels = require('../../models/').MySQL,
    accountUsersModel = mysqlModels.AccountUsers;


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

        try {
            const account_user_data = await accountUsersModel.find_association(account_id, user_id);

            // if associated, carry on
            if (account_user_data.length)
                return next();

            // if they aren't send error message
            return res.status(403).send({
                statusCode: 403,
                errorCode: 'InsufficientAccountPermissions',
                errorMessage: 'Not associated.'
            });
        } catch (err) {
            const err = responseHandler.handleError(error);
            return res.status(err.statusCode).json(err);
        }
    }
};