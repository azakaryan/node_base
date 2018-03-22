"use strict";

const mongoose = require('mongoose'),
    mysql = require('mysql2/promise');

const util = require('../util/'),
    logger = util.Logger;

let connection;


/**
 * @type function
 * @access private
 * @param db_config
 * @description Creates MySQL connection and handles disconnect.
 */
async function _connectAndHandleDisconnect(db_config) {
    try {
        connection = await mysql.createConnection(db_config);
        logger.info(`MySQL connection open to: ${db_config.database} as ${connection.connection && connection.connection.threadId}`);

        connection.on('error', (err) => {
            logger.warn(`MySql DB error: ${err.code}`);

            // Usually lost due to either server restart, or connection idle timeout.
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                _connectAndHandleDisconnect(db_config);
            } else {
                throw err;
            }
        });

    } catch (err) {
        // The server is either down or restarting (takes a while sometimes).
        logger.warn(`MySQL connection error: ${err.code}`);

        // Delay before attempting to reconnect, to avoid a hot loop.
        setTimeout(() => _connectAndHandleDisconnect(db_config), 5000);
    }
}


module.exports = {

    mysql: {
        /**
         * @type function
         * @access public
         * @param db_config
         * @description Initialize MySQL connection.
         */
        init: (db_config) => {
            if (!db_config)
                throw new Error("`db_config` is not specified.");

            _connectAndHandleDisconnect(db_config).catch((err) => {throw err});
        },

        /**
         * @type function
         * @access public
         * @description Get connection.
         * @returns {*}
         */
        getConnection() {
            return connection;
        },

        /**
         * @type function
         * @access public
         * @description Destroy MySQL connection.
         */
        destroy() {
            connection && connection.end(() => logger.info('MySQL connection disconnected through app termination'));
        }
    },

    mongoose: {
        /**
         * @type function
         * @access public
         * @param mongodbUrl
         * @description Initialize Mongoose connection.
         */
        init(mongodbUrl) {
            if (!mongodbUrl)
                throw new Error("`mongodbUrl` is not specified.");

            const options = {
                promiseLibrary: Promise,
                reconnectTries: Number.MAX_VALUE,
                socketTimeoutMS: 30000
            };

            mongoose.connect(mongodbUrl, options);

            // When successfully connected
            mongoose.connection.on('connected', () => logger.info(`Mongoose connection open to: ${mongodbUrl}`));

            // If the connection throws an error
            mongoose.connection.on('error', (err) => logger.error(`Mongoose connection error: ${err}`));

            // When the connection is disconnected
            mongoose.connection.on('disconnected', () => logger.warn('Mongoose connection disconnected'));
        },

        /**
         * @type function
         * @access public
         * @description Destroy Mongoose connection.
         */
        destroy() {
            mongoose.disconnect(() => logger.info('Mongoose connection disconnected through app termination'));
        }
    }
};