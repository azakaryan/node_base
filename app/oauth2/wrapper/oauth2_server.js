"use strict";

const oauthserver = require('oauth2-server'),
    Model = require('./model'),
    server = oauthserver({
        model: new Model(),
        grants: ['password', 'refresh_token'],
        accessTokenLifetime: 86400,
        debug: process.env.NODE_ENV !== 'production'
    });

module.exports = {
    grant(req, res, next) {
        const grant = server.grant();
        grant(req, res, (err) => {
            if (err.message === 'User credentials are invalid') {
                server.model.checkForExactWrongUserCredentials(req.body.username, req.body.password, (reason) => {
                    if (reason) {
                        if (reason === "WRONG PASSWORD") {
                            return res.status(401).send(_errorHelper(err, {
                                code: 401,
                                error: "wrong_password",
                                message: "The password provided is wrong."
                            }));
                        } else if (reason === "NOT VERIFIED") {
                            return res.status(403).send(_errorHelper(err, {
                                code: 403,
                                error: "not_verified",
                                message: "The user you are trying to access is not verified."
                            }));
                        } else if (reason === "NOT FOUND") {
                            return res.status(404).send(_errorHelper(err, {
                                code: 404,
                                error: "not_found",
                                message: "The user you are trying to access is not found."
                            }));
                        }
                    }
                    next(false, false);
                });
            } else {
                return res.status(400).send(_errorHelper(err, {
                    code: 400,
                    error: "bad_request",
                    message: "Bad Request"
                }));
            }
        });
    },
    authorise(req, res, next) {
        const authorise = server.authorise();
        authorise(req, res, function (err) {
            if (err)
                return res.status(err.code).send(_errorHelper(err));

            next(err);
        });
    },
    errorHandler(err, req, res, next) {
        const errorHandler = server.errorHandler();
        errorHandler(err, req, res, next);
    }
};

/**
 * @type function
 * @access private
 * @param err
 * @param customMessage
 * @description Constructs custom error.
 * @returns {{code: *, name, message: *, error: *, error_description: *}}
 */
function _errorHelper(err, customMessage) {
    const c = customMessage || {};
    return {
        code: c.code || err.code,
        name: err.name,
        message: c.message || err.message,
        error: c.error || err.error,
        error_description: c.error_description || c.message || err.error_description
    };
};