"use strict";

const util = require('../../util/'),
    responseHandler = util.ResponseHandler;

const mysqlModels = require('../../models/').MySQL,
    accountUsersModel = mysqlModels.AccountUsers,
    oauthModel = mysqlModels.Oauth;


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
            return res.status(400).json({
                statusCode: 400,
                errorCode: 'MissingRequiredParameter',
                errorMessage: 'Missing argument(s).'
            });

        try {
            const association = await accountUsersModel.find_association(account_id, user_id);
            if (!association.length)
                return res.status(403).json({
                    statusCode: 403,
                    errorCode: 'InsufficientAccountPermissions',
                    errorMessage: 'Not associated.'
                });
            if (association[0].role === 'READ_ONLY') // TODO move 'READ_ONLY' to some generic place, as well as handle role checking in one general helper module
                return res.status(403).json({
                    statusCode: 403,
                    errorCode: 'InsufficientAccountPermissions',
                    errorMessage: 'Need Admin level permission.'
                });

            // if user is Admin, carry on
            return next();
        } catch (err) {
            const err = responseHandler.handleError(error);
            return res.status(err.statusCode).json(err);
        }
    }
};