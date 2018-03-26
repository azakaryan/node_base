/**
 * @swagger
 * resourcePath: /accounts
 * description: Account API
 * swaggerVersion: 1.0
 */

"use strict";

const router = require('express').Router();
const oAuth2Server = require('../../oauth2/').OAuth2Server;
const middleware = require('../../middleware/'),
    accountMiddle = middleware.Account,
    asyncErrorHandlerMiddle = middleware.AsyncErrorHandler;

const accountsSVC = require('../../services/').Accounts;


/**
 * @swagger
 * path: /accounts
 * operations:
 *   -  httpMethod: GET
 *      summary: Get all Accounts
 *      notes: Return Array of all Accounts
 *      responseClass:
 *      nickname: Get Accounts
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 */
router.get('/',
    asyncErrorHandlerMiddle(
        async (req, res) => {
            const accounts = await accountsSVC.getAllAccounts();
            res.status(200).json(accounts);
        }
    ));


/**
 * @swagger
 * path: /accounts/domainName
 * operations:
 *   -  httpMethod: GET
 *      summary: Check the domain existence
 *      notes: Returns empty response
 *      responseClass:
 *      nickname: Get Check Domain
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: domain_name
 *          paramType: query
 *          required: true
 *          dataType: string
 */
router.get('/domainName',
    asyncErrorHandlerMiddle(
        async (req, res) => {
            const domain_name = req.query.domain_name;

            await accountsSVC.findByDomainName(domain_name);
            res.status(204).json();
        }
    ));



/********************************/
/*** Authorise All Requests *****/
/********************************/
router.use(oAuth2Server.authorise);


// TODO make an appropriate association with a User. WARRNING!!! Association Logic is not implemented yet.
/**
 * @swagger
 * path: /accounts
 * operations:
 *   -  httpMethod: POST
 *      summary: Create a new Account
 *      notes: Returns Database Response Object
 *      responseClass: Db
 *      nickname: Post Register Account
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: Authorization
 *          paramType: header
 *          required: true
 *          dataType: string
 *        - name: args
 *          paramType: body
 *          required: true
 *          dataType: PostAccountArgs
 */
router.post('/',
    accountMiddle.validateCreateAccountArgs,
    asyncErrorHandlerMiddle(
        async (req, res) => {
            const user_id = req.oauth.bearerToken.user_id;
            const args = req.body;

            const data = await accountsSVC.createAccount(user_id, args);
            // TODO make a connection with a user. Logic is not implemented yet.

            res.status(201).json(data);
        }
    ));


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
 *   PostAccountArgs:
 *      id: PostAccountArgs
 *      properties:
 *          name:
 *              type: string
 *              required: true
 *          domain_name:
 *              type: string
 *              required: true
 *
 */