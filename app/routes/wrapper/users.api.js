/**
 * @swagger
 * resourcePath: /users
 * description: Users API
 * swaggerVersion: 1.0
 */

"use strict";

const router = require('express').Router();
const crypto = require('../../util/').Crypto;
const oAuth2Server = require('../../oauth2/').OAuth2Server;
const config = require('../../config/').Config;

const middleware = require('../../middleware/'),
    passwordMiddle = middleware.Password,
    userMiddle = middleware.User,
    asyncErrorHandlerMiddle = middleware.AsyncErrorHandler;

const usersSVC = require('../../services/').Users;


/**
 * @swagger
 * path: /users
 * operations:
 *   -  httpMethod: POST
 *      summary: Create a new User or Associate with an Account (or both)
 *      notes : Returns ...
 *      responseClass:
 *      nickname: Create a new User or Associate with an Account (or both)
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: args
 *          paramType: body
 *          required: true
 *          dataType: PostUserArgs
 *          description: userType is optional, default is `CLIENT`, possible values are `CLIENT` & `ADMIN`
 */
router.post('/', ...asyncErrorHandlerMiddle(
        userMiddle.validatePostUserArgs,
        passwordMiddle.isValidPassword,
        async (req, res) => {
            const username = req.body.email,
                password = crypto.createHash(req.body.password),
                userType = req.body.userType || "CLIENT";          // By default the type is CLIENT

            const data = await usersSVC.createUser(username, password, userType);
            res.json(data);
        }
    ));

/**
 * @swagger
 * path: /users/activation
 * operations:
 *   -  httpMethod: GET
 *      summary: Activate user
 *      notes: Activate User
 *      responseClass: Db
 *      nickname: Activate User
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: key
 *          paramType: query
 *          required: false
 *          dataType: string
 *          description: User activation key
 */
router.get('/activation', ...asyncErrorHandlerMiddle(
        userMiddle.validateUserActivationKeyExistence,
        async (req, res) => {
            const key = req.query.key;

            try {
                await usersSVC.activate(key);
                res.redirect(`${config.website_url()}`);
            } catch (e) {
                if (e["message"] === "KEY_NOT_FOUND") {
                    res.redirect(`${config.rest_url()}/html/key_404.html`);
                } else if (e["message"] === "KEY_EXPIRED") {
                    await usersSVC.updateActivationKey(key)
                    res.redirect(`${config.rest_url()}/html/key_updated.html`);
                } else {
                    throw e;
                }
            }
        }
    ));


/********************************/
/**** Authorise All Requests ****/
/********************************/
router.use(oAuth2Server.authorise);



/**
 * @swagger
 * path: /users/current
 * operations:
 *   -  httpMethod: GET
 *      summary: Get Current User
 *      notes : Returns current User
 *      responseClass: object User
 *      nickname: Get current User
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: Authorization
 *          paramType: header
 *          required: true
 *          dataType: string
 */
router.get('/current', ...asyncErrorHandlerMiddle(
        async (req, res) => {
            const user_id = req.oauth.bearerToken.user_id;

            const data = await usersSVC.getCurrentUser(user_id);
            res.json(data);
        }
    ));

/**
 * @swagger
 * path: /users/current/accounts
 * operations:
 *   -  httpMethod: GET
 *      summary: Get Current User Accounts
 *      notes : Returns Current User Accounts
 *      responseClass: array [Account]
 *      nickname: Get Current User Accounts
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: Authorization
 *          paramType: header
 *          required: true
 *          dataType: string
 */
router.get('/current/accounts', ...asyncErrorHandlerMiddle(
        async (req, res) => {
            const user_id = req.oauth.bearerToken.user_id;

            const data = await usersSVC.getUserAccounts(user_id);
            res.json(data);
        }
    ));




// TODO Think of general way of user ROlE checking
// TODO One way is to have specific functions for each Role.  here for example we can have something called userMiddle.isAdmin
// TODO Or we can have some general middleware called userMiddle.isAuthorised which will guess and check authorisation. However, we should some how specify an endpoint it tries to hit.
// /**
//  * @swagger
//  * path: /users
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Get Users by type
//  *      notes : Returns All User Accounts. Only type ADMIN can retrieve this rout.
//  *      responseClass: object Users User_Accounts Admin
//  *      nickname: Get User Accounts
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: Authorization
//  *          paramType: header
//  *          required: true
//  *          dataType: string
//  */
// router.get('/',
//     userMiddle.isAuthorised,  userMiddle.isAdmin
//     async (req, res) => {
//         try {
//             const data = await usersSVC.getAllUserAccounts();
//             res.json(data);
//         } catch (err) {
//             res.status(err.statusCode).json(err);
//         }
//     });


module.exports = router;


/**
 * @swagger
 * models:
 *
 *   Db:
 *     id: Db
 *     properties:
 *       fieldCount:
 *          type: integer
 *          required: true
 *       affectedRows:
 *          type: integer
 *          required: true
 *       insertId:
 *          type: integer
 *          required: true
 *       serverStatus:
 *          type: integer
 *          required: true
 *       warningCount:
 *          type: integer
 *          required: true
 *       message:
 *          type: string
 *          required: true
 *       protocol41:
 *          type: boolean
 *          required: true
 *       changedRows:
 *          type: integer
 *          required: true
 *
 *   PostUserArgs:
 *     id: PostUserArgs
 *     properties:
 *       email:
 *          type: string
 *          required: true
 *       password:
 *          type: string
 *          required: true
 *       userType:
 *          type: string
 *          required: false
 *
 *   PostActivationArgs:
 *     id: PostActivationArgs
 *     properties:
 *       key:
 *          type: string
 *          required: true
 *
 *   PutActivationArgs:
 *     id: PutActivationArgs
 *     properties:
 *       key:
 *          type: string
 *          required: true
 *
 *   Account:
 *     id: Account
 *     properties:
 *       id:
 *         type: integer
 *         required: true
 *       domain_name:
 *         type: string
 *         required: true
 *
 *
 *   UserRole:
 *     id: UserRole
 *     properties:
 *       role:
 *         type: string
 *         required: true
 *
 *
  */