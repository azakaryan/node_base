"use strict";

const app = require('./app');
const fs = require('fs');
const config = require('./app/config/').Config;
const logger = require('./app/util/').Logger;
const https = require('https');
const http = require('http');


async function init() {
    let server;

    await app.init();

    /**
     * Create HTTPS / HTTP Server.
     */

    if (config.protocol === "https") {
        server = https.createServer({
            key: fs.readFileSync('./ssl_cert/nginx-selfsigned.key'),
            cert: fs.readFileSync('./ssl_cert/nginx-selfsigned.crt')
        }, app.app);
    } else {
        server = http.createServer(app.app);
    }

    server.listen(app.port, app.host, () => {
        logger.warn(`%s Server started on ${config.protocol}://%s:%d`, (new Date()).toISOString(), app.host, app.port);
        logger.warn(`Protocol:  ${config.protocol === "https" ? 'HTTPS' : 'HTTP'}`);
        logger.warn('Environment: ', app.env);
    });

    server.on('error', (error) => {
        if (error.syscall !== 'listen')
            throw error;

        let bind = typeof app.port === 'string'
            ? 'Pipe ' + app.port
            : 'Port ' + app.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                logger.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

    return app.app;
};


module.exports = init();