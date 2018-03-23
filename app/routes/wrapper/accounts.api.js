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
    accountUsersMiddle = middleware.AccountUsers;

const services = require('../../services/'),
    accountsSVC = services.Accounts,
    accountUsersSVC = services.AccountUsers;

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
router.get('/', async (req, res) => {
    try {
        const accounts = await accountsSVC.getAllAccounts();
        res.status(200).json(accounts);
    } catch (err) {
        res.status(err.statusCode).json(err);
    }
});


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
router.get('/domainName', async (req, res) => {
    const domain_name = req.query.domain_name;

    try {
        await accountsSVC.findByDomainName(domain_name);
        res.status(204).json();
    } catch (err) {
        res.status(err.statusCode).json(err);
    }
});



/********************************/
/*** Authorise All Requests *****/
/********************************/
router.use(oAuth2Server.authorise);


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
 *        - name: args
 *          paramType: body
 *          required: true
 *          dataType: PostAccountArgs
 */
router.post('/', accountMiddle.validateCreateAccountArgs, async (req, res) => {
    const args = req.body;

    try {
        const data = await accountsSVC.createAccount(args);
        res.status(201).json(data);
    } catch (err) {
        res.status(err.statusCode).json(err);
    }
});

/**
 * @swagger
 * path: /accounts/{accountId}/admin/email
 * operations:
 *   -  httpMethod: GET
 *      summary: GET Account ADMIN USER email
 *      notes: Returns String
 *      responseClass: string
 *      nickname: GET Account ADMIN mailer
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: Authorization
 *          paramType: header
 *          required: true
 *          dataType: string
 *        - name: accountId
 *          paramType: path
 *          required: true
 *          dataType: integer
 */
router.get('/:accountId/admin/email',
    accountUsersMiddle.isAssociated,
    async (req, res) => {
        const account_id = req.params.accountId;

        try {
            const data = await accountUsersSVC.getAccountAdminEmail(account_id);
            res.status(200).json(data);
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
 *   PostAccountArgs:
 *      id: PostAccountArgs
 *      properties:
 *          name:
 *              type: string
 *              required: true
 *          domain_name:
 *              type: string
 *              required: true
 *          description:
 *              type: text
 *              required: false
 *
 */