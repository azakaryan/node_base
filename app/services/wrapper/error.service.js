"use strict";

const maintainersModel = require('../../models/').MySQL.Maintainers;
const mailerSVC = require('./mailer/mailer.service');


module.exports = {

    /**
     * @type async function
     * @access public
     * @param error
     * @param date
     * @param environment
     * @param status
     * @param name
     * @param message
     * @description Send error email to all maintainers.
     * @returns {async}
     */
    async errorHandler(error, date, environment, status, name, message) {
        try {
            const maintainers = await maintainersModel.getEnabledMaintainersEmail();

            if (!maintainers.length)
                throw 'NO_ENABLED_MAINTAINER_FOUND';

            const receivers = maintainers.map((obj) => obj.email).join(',');

            // Send Emails
            return await mailerSVC.sendErrorEmail(receivers, error, date, environment, status, name, message);
        } catch (e) {
            throw e;
        }
    }
};