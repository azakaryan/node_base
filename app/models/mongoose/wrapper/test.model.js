"use strict";

const MODEL_PATH = '../../../db/mongoose/';
const Test = require(MODEL_PATH).Test;

// TODO Not Ready yet
module.exports = {

    /**
     * @type function
     * @access public
     * @param records
     * @param account_id
     * @description Add Test.
     * @returns {Promise}
     */
    addTest: (records, account_id) => {
        return new Promise((resolve, reject) => {
            let k = Test.create(
                {
                    account_id: account_id,
                    analytics: records
                }, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
        });
    },

    // TODO.
    // /**
    //  * @type function
    //  * @access public
    //  * @param account_id
    //  * @description Remove the Test(s) document of specified account.
    //  * @returns {Promise}
    //  */
    // removeTest: (account_id) => {
    //     return new Promise((resolve, reject) => {
    //         Test.remove({account_id: account_id.toString()}, (err, response) => {
    //             if (err)
    //                 return reject(err);
    //
    //             resolve(response);
    //         });
    //     });
    // },

    // /**
    //  * @type function
    //  * @access public
    //  * @param account_id
    //  * @description Update the Test(s) document of specified account.
    //  * @returns {Promise}
    //  */
    // updateTest: (account_id) => {
    //     return new Promise((resolve, reject) => {
    //         AnalyticsMeta.findOneAndUpdate(
    //             {account_id: account_id.toString()},
    //             {
    //                 $set: {
    //                     account_name: account_name,
    //                 }
    //             },
    //             {new: true}, (err, result) => {
    //                 if (err)
    //                     return reject(err);
    //
    //                 resolve(result);
    //             });
    //     });
    //
    // }
};