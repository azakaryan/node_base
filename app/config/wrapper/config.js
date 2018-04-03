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

const config = {

    development: Object.assign({
        host: '127.0.0.1', // local host to run the server
        port: '9000',      // local port to run the server
        web_host: 'localhost',
        web_port: '3000',
        protocol: 'https',

        db: {
            dialect: 'mysql',
            multipleStatements: true,
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'node_base'
        },
        mongodbUrl: 'mongodb://localhost:27017/node_base',

        swagger_url: '/swagger',
        api_version: 'v1',

        rest_endpoint_base_url () {
            return `/api/${this.api_version}`;
        },

        rest_url () {
            return `${this.protocol}://${this.host}:${this.port}`;
        },

        website_url () {
            return `${this.protocol}://${this.web_host}:${this.web_port}`;
        },

        settings: {
            ACTIVATION_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            FORGOT_PASSWORD_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            TEMPORARY_CSV_EXPIRE_TIME: 5 * 60 * 1000 // 5 min.
        },

        email: {
            username: "azakaryantest@gmail.com",
            password: "Vk3!6P8zK7Pw^,R",
            contact_support: 'https://github.com/azakaryan/node_base'
        }
    }, localEnv),

    production: Object.assign({
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

        swagger_url: '/swagger',
        api_version: 'v1',

        rest_endpoint_base_url () {
            return `/api/${this.api_version}`;
        },

        rest_url () {
            return `${this.protocol}://${this.host}:${this.port}`;
        },

        website_url () {
            return `${this.protocol}://${this.web_host}:${this.web_port}`;
        },

        settings: {
            ACTIVATION_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            FORGOT_PASSWORD_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            TEMPORARY_CSV_EXPIRE_TIME: 5 * 60 * 1000 // 5 min.
        },

        email: {
            username: "azakaryantest@gmail.com",
            password: "Vk3!6P8zK7P\\w^,R"
        }
    }, localEnv),


    /* TEST ENV */
    test: Object.assign({
        host: '127.0.0.1', // local host to run the test server
        port: '9001',      // local port to run the test server
        web_host: 'localhost',
        web_port: '3000',
        protocol: 'https',

        db: {
            dialect: 'mysql',
            multipleStatements: true,
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'node_base_test'
        },
        mongodbUrl: 'mongodb://localhost:27017/node_base_test',

        swagger_url: '/swagger',
        api_version: 'v1',

        rest_endpoint_base_url () {
            return `/api/${this.api_version}`;
        },

        rest_url () {
            return `${this.protocol}://${this.host}:${this.port}`;
        },

        website_url () {
            return `${this.protocol}://${this.web_host}:${this.web_port}`;
        },

        settings: {
            ACTIVATION_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            FORGOT_PASSWORD_KEY_EXPIRE_TIME: 60 * 60 * 1000, // 1 hour
            TEMPORARY_CSV_EXPIRE_TIME: 5 * 60 * 1000 // 5 min.
        },

        email: {
            username: "azakaryantest@gmail.com",
            password: "Vk3!6P8zK7Pw^,R",
            contact_support: 'https://github.com/azakaryan/node_base'
        }
    })
};

module.exports = config[env];