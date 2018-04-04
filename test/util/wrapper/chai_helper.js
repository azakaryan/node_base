"use strict";

const server = require('../../../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
let app = null;

module.exports = {

    async init() {
        // Instantiate the Server. Make sure to call this on startup on "before" block.
        app = await server;
    },

    get_chai() {
        return chai;
    },

    get_requester() {
        // Create chai request specifying express app.
        return chai.request(app);
    }

};