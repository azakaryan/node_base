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

const middleware = require('../../middleware/'),
    passwordMiddle = middleware.Password,
    userMiddle = middleware.User;

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
router.post('/',
    userMiddle.validatePostUserArgs,
    passwordMiddle.isValidPassword, async (req, res) => {

        const username = req.body.email,
            password = crypto.createHash(req.body.password),
            accountDomainName = req.body.accountDomainName,
            userType = req.body.userType || "CLIENT"; // By default the type is client

        usersSVC.createUser(username, password, accountDomainName, userType).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(err.statusCode).json(err);
        });
    });


/**
 * @swagger
 * path: /users/activation
 * operations:
 *   -  httpMethod: POST
 *      summary: Activate user
 *      notes: Activate User
 *      responseClass: Db
 *      nickname: Activate User
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: body
 *          paramType: body
 *          required: true
 *          dataType: PostActivationArgs
 */
router.post('/activation', (req, res) => {

    const key = req.body.key;

    usersSVC.activate(key).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(err.statusCode).json(err);
    });
});


/**
 * @swagger
 * path: /users/activation
 * operations:
 *   -  httpMethod: PUT
 *      summary: Update activation key
 *      notes: Update activation key
 *      responseClass: string
 *      nickname: Update activation key
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: body
 *          paramType: body
 *          required: true
 *          dataType: PutActivationArgs
 */
router.put('/activation', (req, res) => {

    const key = req.body.key;

    usersSVC.updateActivation(key).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(err.statusCode).json(err);
    });
});


// Authorise all requests
router.use(oAuth2Server.authorise);



/**
 * @swagger
 * path: /users
 * operations:
 *   -  httpMethod: GET
 *      summary: Get Users by type
 *      notes : Returns All Users by type. Only Admin can retrieve this rout.
 *      responseClass: object Users User_Accounts Admin Client
 *      nickname: Get Users by type
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: Authorization
 *          paramType: header
 *          required: true
 *          dataType: string
 *      parameters:
 *        - name: type
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/', userMiddle.isAuthorised, (req, res) => {
    usersSVC.getAllUserAccountsByUserType(req.query.type).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(err.statusCode).json(err);
    });
});


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
router.get('/current', (req, res) => {

    const user_id = req.oauth.bearerToken.user_id;

    usersSVC.getCurrentUser(user_id).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(err.statusCode).json(err);
    });
});


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
router.get('/current/accounts', async (req, res) => {

    const user_id = req.oauth.bearerToken.user_id;

    try {
        const data = await usersSVC.getUserAccounts(user_id);
        res.json(data);
    } catch (err) {
        res.status(err.statusCode).json(err);
    }
});



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
 *       accountDomainName:
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