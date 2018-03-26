"use strict";

const uuid = require('uuid');
const config = require('../../config/').Config;
const logger = require('../../util/').Logger;
const mailerSVC = require('./mailer/mailer.service');
const mysqlModels = require('../../models/').MySQL,
    profilesModel = mysqlModels.Profiles,
    accountUsersModel = mysqlModels.AccountUsers,
    usersModel = mysqlModels.Users,
    userActivationKeysModel = mysqlModels.UserActivationKeys;


module.exports = {

    /**
     * @type asunc function
     * @access public
     * @param user_id
     * @description Get current user.
     * @returns {async}
     */
    async getCurrentUser(user_id) {
        try {
            let user = await usersModel.findById(user_id);

            if (!user)
                throw new Error('USER_NOT_FOUND');

            return user;
        } catch (e) {
            throw e;
        }
    },

    /**
     * @type async function
     * @access public
     * @param user_id
     * @description (wrapper) Get User account.
     * @returns {async}
     */
    async getUserAccounts(user_id) {
        try {
            return await accountUsersModel.getUserAccounts(user_id);
        } catch (e) {
            throw e;
        }
    },

    /**
     * @type async function
     * @access public
     * @param username
     * @param password
     * @param userType
     * @description Create a new user.
     * @returns {async}
     */
    async createUser(username, password, userType) {
        try {
            const user = await usersModel.findByUsername(username);

            if (user) {
                // If user found and not Activated, resend an email for an activation.
                if (user.verified === 0) {
                    logger.info("User Exist. NOT verified. Sending Activation Email ...");

                    const activationKey = uuid.v4();
                    await userActivationKeysModel.update(user.id, activationKey);
                    await mailerSVC.sendAccountConfirmationEmail(username, activationKey);
                    return "Successfully updated activation. Please check your email!";
                } else {
                    throw new Error("USER_EXISTS");
                }
            }

            // Create an Appropriate User, Profile as well as send an email for Verificaton. By default the user type is a "CLIENT".
            logger.info("Creating a new User ...");
            const insertedUser = await usersModel.create(username, password, userType);
            const user_id = insertedUser.insertId;
            await profilesModel.create(user_id);
            const activationKey = uuid.v4();
            await userActivationKeysModel.create(user_id, activationKey);
            await mailerSVC.sendAccountConfirmationEmail(username, activationKey);
            return 'Thanks for registering, please check your mailbox for a confirmation email.';
        } catch (e) {
            throw e;
        }
    },

    /**
     * @type async function
     * @access public
     * @param key
     * @description Activate the user.
     * @returns {async}
     */
    async activate(key) {
        try {
            const userActivationKey = await userActivationKeysModel.getUserActivationKey(key);

            if (!userActivationKey)
                throw new Error('KEY_NOT_FOUND');

            // Check Expiration
            if (Date.now() - userActivationKey["issued_date"] > config.settings.ACTIVATION_KEY_EXPIRE_TIME)
                throw new Error('KEY_EXPIRED');

            // Activate the User
            return await usersModel.activateUser(userActivationKey.user_id);

        } catch (e) {
            throw e;
        }
    },

    /**
     * @type async function
     * @access public
     * @param key
     * @description Update activation key.
     * @returns {async}
     */
    async updateActivationKey(key) {
        try {
            const [userData] = await userActivationKeysModel.getUserIdAndEmailByActivationKey(key);

            if (!userData)
                throw new Error('USER_NOT_FOUND');

            const newKey = uuid.v4();
            await userActivationKeysModel.update(userData.id, newKey);
            await mailerSVC.sendAccountConfirmationEmail(userData.username, newKey);

            return "Successfully updated activation. Please check your email!";
        } catch (e) {
            throw e;
        }
    }
};