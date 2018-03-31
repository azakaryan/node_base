'use strict';

const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const appDir = require('path').dirname(require.main.filename);
const mustache = require('mustache');
const config = require('../../../config/').Config;
const util = require('../../../util/'),
    logger = util.Logger,
    nodeMailer = util.NodeMailer;

const icon_path = `${appDir}/public/assets/mailer/icon.png`;


module.exports = {

    /**
     * @type async function
     * @access public
     * @param email
     * @param key
     * @description Send user account confirmation email.
     * @returns {async}
     */
    async sendAccountConfirmationEmail(email, key) {
        const verification_url = `${config.rest_url()}${config.rest_endpoint_base_url()}/users/activation?key=${key}`;

        logger.info('Sending Email...');
        logger.info(` Website URL: ${config.website_url()}`);
        logger.info(` Verification URL: ${verification_url}`);
        logger.info(` Receiver: ${email}`);

        try {
            const template = await _getTemplate('accountActivation');

            const response = await nodeMailer.sendMail({
                from: config.email.username,
                to: email,
                subject: 'Account Activation',
                html: mustache.render(template.toString(), {
                    verification_url: verification_url,
                    contact_support: config.email.contact_support,
                }),
                generateTextFromHtml: true,
                attachments: [{
                    path: icon_path,
                    cid: 'icon'
                }]
            });

            logger.info('Email is send.');
            return response;
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * @type function
     * @access public
     * @param receivers
     * @param error
     * @param date
     * @param environment
     * @param status
     * @param name
     * @param message
     * @description Send error email.
     * @returns {bluebird}
     */
    async sendErrorEmail(receivers, error, date, environment, status, name, message) {
        logger.info('Sending Email...');
        logger.info(` Receiver(s): ${receivers}`);
        logger.info(` Date: ${date}`);

        try {
            const template = await _getTemplate('error');

            const response = await nodeMailer.sendMail({
                from: config.email.username,
                to: receivers,
                subject: 'Internal Server Error',
                html: mustache.render(template.toString(), {
                    error: error,
                    date: date,
                    environment: environment,
                    status: status,
                    name: name,
                    message: message
                }),
                generateTextFromHtml: true,
                attachments: [{
                    path: icon_path,
                    cid: 'icon'
                }]
            });

            logger.info('Email is send.');
            return response;
        } catch (err) {
            throw new Error(err);
        }
    }
};


/**
 * @type async function
 * @access private
 * @param templateName
 * @description Loads specified template.
 * @returns {async}
 */
async function _getTemplate(templateName) {
    try {
        return await readFileAsync(`${__dirname}/templates/${templateName}.html`, {encoding: 'utf8'});
    } catch (err) {
        throw new Error(err);
    }
}