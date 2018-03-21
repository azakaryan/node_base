"use strict";

const localEnv = _loadLocalEnv(),
    env = process.env.NODE_ENV || 'development';


/**
 * @type function
 * @access private
 * @description Load .env.js file if such exists.
 * @returns {{}}
 */
function _loadLocalEnv() {
    let env = {};
    try {
        env = require('../../../.env');
    } catch (e) {
        if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
            console.log(".env not specified");
        else
            throw e;
    }
    return env;
}


/**
 * @property {string}  host
 * @property {string}  port
 * @property {string}  protocol
 * @property {object}  db
 * @property {string}  mongodbUrl
 * @property {string}  api_version
 * @property {function}  rest_url
 * @property {string}  swagger_url
 * @property {function}  website_url
 * @property {object}  settings
 */
const config = {

    development: {
        host: localEnv.host || '127.0.0.1', // local host to run the server
        port: localEnv.port || '9000',      // local port to run the server
        web_host: 'localhost',
        web_port: localEnv.port || '9000',
        protocol: localEnv.protocol || 'https',

        db: localEnv.db || {
            dialect: 'mysql',
            multipleStatements: true,
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'node_base'
        },
        mongodbUrl: localEnv.mongodbUrl || 'mongodb://localhost:27017/node_base',

        api_version: 'v1',
        rest_url () {
            return `/api/${this.api_version}`;
        },

        swagger_url: '/swagger',

        website_url () {
            return `${this.protocol}://${this.host}:${this.web_port}`;
        },

        settings: {
            ACTIVATION_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            FORGOT_PASSWORD_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            TEMPORARY_CSV_EXPIRE_TIME: 5 * 60 * 1000 // 5 min.
        }
    },

    staging: {},

    production: {
        host: '127.0.0.1', // local host to run the server
        port: '3000',   // local port to run the server
        web_host: 'app.node_base.com',
        web_port: '443',
        protocol: 'https',

        db: {
            dialect: 'mysql',
            multipleStatements: true,
            host: '127.0.0.1',
            user: 'root',
            password: 'node_base',
            database: 'node_base'
        },
        mongodbUrl: 'mongodb://localhost:27017/node_base',

        api_version: 'v1',
        rest_url () {
            return `/api/${this.api_version}`;
        },

        swagger_url: '/swagger',

        website_url () {
            return `${this.protocol}://${this.web_host}:${this.web_port}`;
        },

        settings: {
            ACTIVATION_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            FORGOT_PASSWORD_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            TEMPORARY_CSV_EXPIRE_TIME: 5 * 60 * 1000 // 5 min.
        }
    }
};

module.exports = config[env];