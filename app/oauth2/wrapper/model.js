"use strict";

const _ = require('lodash'),
    crypto = require('../../util/index').Crypto,
    mysql = require('../../db/db').mysql;


module.exports = class Model {

    async getAccessToken(bearerToken, callback) {
        const query = 'SELECT * FROM oauth_access_token WHERE access_token=?';

        try {
            const [result] = await mysql.getConnection().execute(query, [bearerToken]);
            if (result.length) {
                callback(false, result[0]);
            } else {
                callback(false, false);
            }
        } catch (err) {
            callback(true);
        }
    }

    async getRefreshToken(bearerToken, callback) {
        const query = 'SELECT * FROM oauth_refresh_token WHERE refresh_token=?';

        try {
            const [result] = await mysql.getConnection().execute(query, [bearerToken]);
            if (result.length) {
                result[0].clientId = result[0].client_id;
                result[0].userId = result[0].user_id;
                callback(false, result[0]);
            } else {
                callback(false, false);
            }
        } catch (err) {
            callback(true);
        }
    }

    async getClient(clientId, clientSecret, callback) {
        const query = 'SELECT * FROM oauth_client WHERE client_id=? AND client_secret=?';

        try {
            const [result] = await mysql.getConnection().execute(query, [clientId, clientSecret]);
            if (result.length) {
                result[0].clientId = result[0].client_id;
                result[0].userId = result[0].user_id;
                callback(false, result[0]);
            } else {
                callback(false, false);
            }
        } catch (err) {
            callback(true);
        }
    }

    grantTypeAllowed(clientId, grantType, callback) {
        const allowedGrantTypes = {
            refresh_token: true,
            password: true
        };
        callback(false, allowedGrantTypes[grantType]);
    }

    async saveAccessToken(accessToken, clientId, expires, user, callback) {
        const expire = expires.toISOString().slice(0, 19).replace('T', ' '),
            currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
            query = 'INSERT INTO oauth_access_token (access_token, client_id, user_id, expires) VALUES (?, ?, ?, ?)';

        try {
            await mysql.getConnection().execute(query, [accessToken, clientId, user["id"], expire]);
            await mysql.getConnection().execute(`UPDATE user SET last_login=? WHERE id=? `, [currentDate, user["id"]]); // Update last login time
            callback(false); // Pass On
        } catch (err) {
            callback(true);
        }
    }

    async saveRefreshToken(refreshToken, clientId, expires, user, callback) {
        const expire = expires.toISOString().slice(0, 19).replace('T', ' ');
        const query = 'INSERT INTO oauth_refresh_token (refresh_token, client_id, user_id, expires) VALUES (?, ?, ?, ?)';

        try {
            await mysql.getConnection().execute(query, [refreshToken, clientId, user["id"], expire]);
            callback(false); // Pass On
        } catch (err) {
            callback(true);
        }
    }

    async getUser(username, password, callback) {
        const query = 'SELECT * FROM user WHERE user.username=?';

        try {
            const [result] = await mysql.getConnection().execute(query, [username]);
            const user = _.first(result);

            if (!result.length || !crypto.isValidPassword(user.password, password) || !user['verified'])
                return callback(false, false);

            callback(false, user); // Pass On
        } catch (err) {
            callback(true);
        }
    }

    // Have to define this custom method to send custom messages otherwise the same 404 will be send for different credentials
    async checkForExactWrongUserCredentials(username, password, callback) {
        const query = 'SELECT * FROM user WHERE user.username=?';

        try {
            const [result] = await mysql.getConnection().execute(query, [username]);
            const user = _.first(result);

            if (!result.length)
                return callback("NOT FOUND");

            if (!crypto.isValidPassword(user.password, password))
                return callback("WRONG PASSWORD");

            // Check for validation
            if (user && !user['verified'])
                return callback("NOT VERIFIED");

            callback(); // Pass On
        } catch (err) {
            callback(true);
        }
    }
};