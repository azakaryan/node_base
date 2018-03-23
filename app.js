"use strict";

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const swagger = require('swagger-express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const Routes = require('./app/routes/');
const db = require('./app/db/db');
const config = require('./app/config/').Config;
const logger = require('./app/util/').Logger;
const errorSVC = require('./app/services/').Error;


class App {

    constructor() {
        this.app = express();
        this.port = config.port;
        this.host = config.host;
        this.env = this.app.get('env');
    }

    /*
     * Initialize the App
     */
    async init() {
        try {
            this._staticDirectorySetup();                /* Setup Static(Public) directory to serve public content */

            this._loggerSetup();                         /* Setup Advanced logger for both production as well as development */

            this._requestParserSetup();                  /* Setup Request Parser for body context */

            await this._initializeDatabases();           /* Initialize Databases */

            this.routes = new Routes(this.app);          /* Main Application start */

            this._swaggerSetup();                        /* Swagger Setup */

            this._errorHandler();                        /* Append Error Handler middleware */
        } catch (err) {
            logger.info(err);
            throw new Error(err);
        }
    }

    _staticDirectorySetup() {
        this.app.use(express.static(path.join(__dirname, 'public'))); // set public directory to be served by Node.
    }

    async _initializeDatabases() {
        try {
            await db.mysql.init(config.db);
            db.mongoose.init(config.mongodbUrl);  // No need to `await` on this, mongoose 4 handles connection buffering internally
        } catch (err) {
            throw new Error(err);
        }
    }

    _loggerSetup() {
        const logDir = path.join(__dirname, 'logs');
        fs.existsSync(logDir) || fs.mkdirSync(logDir, 0o777); // ensure log directory exists
        const requestLogStream = rfs('request.log', {interval: '1d', path: logDir}); // create a rotating write stream
        this.app.use(morgan('common', {stream: requestLogStream})); // setup the stream
        this.env !== 'production' && this.app.use(morgan('dev')); // log each request
    }

    _requestParserSetup() {
        this.app.use(bodyParser.json()); // Parses the text as JSON & exposes the resulting object on req.body.
        this.app.use(bodyParser.urlencoded({extended: true})); // Parses the text as URL encoded data
    }

    _swaggerSetup() {
        this.app.use(swagger.init(this.app, {
            apiVersion: config.api_version,
            swaggerVersion: '1.0',
            swaggerURL: config.swagger_url,
            swaggerJSON: '/api-docs.json',
            swaggerUI: './node_modules/swagger-ui/dist',
            basePath: `${config.protocol}://${config.web_host}:${config.web_port}${config.rest_url()}`,
            apis: this.routes.swagger_apis,
            info: {
                title: 'node base',
                description: 'NodeBase REST API'
            },
            middleware: (req, res) => {}
        }));
    }

    _errorHandler() {
        // Error handler (middleware)
        this.app.use((err, req, res, next) => {
            errorSVC.errorHandler(err.stack, (new Date).toISOString(), this.env, err.status, err.name,
                err.message).catch((err) => {
                logger.warn(err.errorMessage);
            });

            res.status(err.status || 500).json({
                statusCode: err.status || 500,
                errorCode: err.name || 'InternalError',
                errorMessage: err.message || 'The server encountered an internal error. Please retry the request.'
            });
            next();
        });
    }
}

module.exports = new App();