"use strict";

const logger = require('../../util/').Logger;

/*
 * Custom Error Handler.
 */
class ErrorHandler extends Error {
    constructor(statusCode, errorCode, errorMessage) {
        super(errorMessage);
        Object.assign(this, {statusCode, errorCode, errorMessage, name: "ErrorHandler"});
    }
}


module.exports = {

    /**
     * @type function
     * @access public
     * @param err
     * @description Custom Error handler.
     * @returns {ErrorHandler}
     */
    handleError(error) {
        let err,
            valueToSwitch = (error.code || (error.name !== 'Error' && error.name) || error.message);

        switch (valueToSwitch) {
            /**
             * MySQL Errors
             */
            case 'ER_WARN_DATA_OUT_OF_RANGE':
                err = new ErrorHandler(400, "OutOfRangeInput", 'One of the request inputs is out of range.');
                break;

            case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD': case 'WARN_DATA_TRUNCATED': case 'ER_BAD_NULL_ERROR':
                err = new ErrorHandler(400, "InvalidInput", 'One of the request inputs is not valid.');
                break;

            case 'ER_DATA_TOO_LONG':
                err = new ErrorHandler(400, "InvalidInput", 'One of the request inputs is too long.');
                break;

            case 'ER_DUP_ENTRY':
                err = new ErrorHandler(409, "ResourceAlreadyExists", 'The specified resource already exists.');
                break;


            /**
             * Mongodb Errors
             */
            case 11000:
                err = new ErrorHandler(409, "ResourceAlreadyExists", 'The specified resource already exists.');
                break;

            /**
             * Custom Errors
             */
            case 'NOT_FOUND':
                err = new ErrorHandler(404, "ResourceNotFound", 'The requested SObject does not exist.');
                break;

            case 'ACCOUNT_NOT_FOUND':
                err = new ErrorHandler(404, "ResourceNotFound", 'The specified account does not exist.');
                break;

            case 'NO_ENABLED_MAINTAINER_FOUND':
                err = new ErrorHandler(404, "ResourceNotFound", 'The enabled maintainer(s) does not exist.');
                break;

            case 'USER_NOT_FOUND':
                err = new ErrorHandler(404, "ResourceNotFound", 'The specified user does not exist.');
                break;

            case 'KEY_NOT_FOUND':
                err = new ErrorHandler(404, "ResourceNotFound", 'Key is not found.');
                break;

            case 'USER_ACCOUNT_ASSOCIATION_EXISTS':
                err = new ErrorHandler(409, "ResourceAlreadyExists", 'User_Account association is already exists.');
                break;

            case 'KEY_IS_USED':
                err = new ErrorHandler(416, "InvalidResource", 'Key is used already.');
                break;

            case 'KEY_EXPIRED':
                err = new ErrorHandler(416, "InvalidResource", 'Key is expired.');
                break;

            case 'KEY_USAGE_UPDATE_ERROR':
                err = new ErrorHandler(424, "FailedUpdate", 'Failed to update key usage.');
                break;

            case 'PASSWORD_RESET_KEY_SAVE_ERROR':
                err = new ErrorHandler(424, "FailedCreateUpdate", 'Failed to create/update the key.');
                break;

            case 'USER_ACTIVATION_KEY_SAVE_ERROR':
                err = new ErrorHandler(424, "FailedCreate", 'Failed to create the key.');
                break;

            /**
             * Unknown Errors
             */
            default:
                logger.error(
                    `
                        ########################
                        ##### ATTENTION!!! #####
                        ########################
                        ##  UNKNOWN EXCEPTION ##
                    `,
                    JSON.stringify(error.stack)
                );

                logger.error(
                    `
                        ### General Error ###
                    `,
                    JSON.stringify(error)
                );

                err = new ErrorHandler(500, "InternalError", 'The server encountered an internal error. Please retry the request.');
        }

        return err;
    }
};