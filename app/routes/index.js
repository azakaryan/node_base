"use strict";

const _ = require('lodash');
const express = require('express');
const oAuth2Server = require('../oauth2/').OAuth2Server;
const router = express.Router();
const main_router = express.Router();
const configs = require('../config/'),
    config = configs.Config,
    headers = configs.Headers;


module.exports = class Routes {
    constructor(app) {
        this.main_apis = [
            {
                route: '/users',
                url: './wrapper/users.api.js'
            },
            {
                route: '/accounts',
                url: './wrapper/accounts.api.js'
            }
        ];

        /** Set Cross Origin Headers **/
        headers.setCrossOriginHeaders(app);

        // Handle token grant requests
        router.all('/oauth/token', oAuth2Server.grant);

        /** Swagger setup **/
        this.swagger_apis = _.map(this.main_apis, 'url');
        this.swagger_apis = _.map(this.swagger_apis, (url) => url.replace('./', './app/routes/') );
        this.swagger_apis = this.swagger_apis.concat(['./app/routes/index.js']);

        /** routing **/
        app.use(config.rest_endpoint_base_url(), router);
        router.use('/', main_router);
        this._use(this.main_apis);
    }

    _use(apis) {
        _.each(apis, (api) => main_router.use(api.route, require(api.url)));
    }
}