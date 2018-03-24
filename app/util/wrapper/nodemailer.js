"use strict";

const nodemailer = require('nodemailer');
const logger = require('../').Logger;
const config = require('../../config/').Config;

/**
 * @description Create NodeMailer transporter (Login).
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.username,
        pass: config.email.password,
    }
});

/**
 * @description Verify connection configuration.
 */
transporter.verify((error) => {
    if (error)
        logger.error(`Email Transporter Error: ${error}`);
});

module.exports = transporter;