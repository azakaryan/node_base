/**
 * Before running the test make sure the database is instantiated. For now it's a manual.
 * TODO make database initialization automatic.
 */

"use strict";


const mysql = require('../../../../app/db/db').mysql;
const config = require('../../../../app/config/').Config;
const chai_helper = require('../../../util/').Chai_Helper;


// database init
before( async function() {
    await mysql.init(config.db);
    this.expect = chai_helper.get_chai().expect;
});