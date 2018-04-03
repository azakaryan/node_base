"use strict";

const config =  require('../../../../app/config/').Config;
const accountsData = require('../../../data/').AccountsData;
const chai_helper = require('../../util/').Chai_Helper;

/**
 * Accounts Api tests.
 *
 */
describe('Accounts API Tests', () => {

    beforeEach( async function() {
        this.requester = chai_helper.get_requester();
        this.expect = chai_helper.get_chai().expect;
    });

    /*
     * Test the /GET route
     *
     */
    describe('/GET Acconts', () => {

        it("it should GET the Acccount", function(done) {
            this.requester
                .get(`${config.rest_endpoint_base_url()}/accounts/domainName?domain_name=${accountsData.success.name}`)
                .end((err, res) => {
                    this.expect(accountsData.success.status, res.status);
                    done();
                });
        });

        it("it should't GET Acccount", function(done) {
            this.requester
                .get(`${config.rest_endpoint_base_url()}/accounts/domainName?domain_name=${accountsData.err.name}`)
                .end((err, res) => {
                    this.expect(accountsData.err.status, res.status);
                    done();
                });
        });

    });

});