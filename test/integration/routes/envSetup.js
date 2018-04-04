"use strict";

const chai_helper = require('../../util/').Chai_Helper;

/*
 * Global Setup for Integration Tests.
 *
 */
before( async function() {

    await chai_helper.init();

    this.expect = chai_helper.get_chai().expect;

    // TODO,
    // Before Running the tests empty the test database
});

after(() => {
    console.log('TODO After All tests CleanUp the Database');
});