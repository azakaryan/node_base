/**
 * Accounts Model tests.
 *
 * Global(s) used in this test: NO
 */

"use strict";

const accountsData = require('../../../../data/').AccountsData;
const accountsModel = require('../../../../../app/models/').MySQL.Accounts;


describe('Accounts Model', () => {

    describe('createAccount', () => {

        before(async () => {
            // Clean Up
            await accountsModel.deleteByDomainName(accountsData.postSuccessData.domain_name);
        });

        it('should create account', async function() {
            const data = await accountsModel.createAccount(accountsData.postSuccessData.name, accountsData.postSuccessData.domain_name);

            this.expect(data).to.be.instanceOf(Object);
            this.expect(data).to.have.deep.property('affectedRows', 1);
            this.expect(data).to.have.deep.property('insertId');
            this.accountId = data.insertId;
        });

        it('should get Error. Duplicate entry. Trying to use the same domain_name', async function() {
            try {
                await accountsModel.createAccount(accountsData.postSuccessData.name, accountsData.postSuccessData.domain_name);
            } catch (err) {
                this.expect(err).to.be.instanceOf(Object);
                this.expect(err.message).to.contain("Duplicate entry");
            }
        });

        it('should find by domain name', async function() {
            const data = await accountsModel.findByDomainName(accountsData.postSuccessData.domain_name);

            this.expect(data).to.be.instanceOf(Object);
            this.expect(data).to.have.deep.property('id', this.accountId);
            this.expect(data).to.have.deep.property('name', accountsData.postSuccessData.name);
            this.expect(data).to.have.deep.property('domain_name', accountsData.postSuccessData.domain_name);
        });
    });

});