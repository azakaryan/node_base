"use strict";


/**
 * @type function
 * @access public
 * @param req
 * @param res
 * @param next
 * @description - Since Async Await is essentially syntactic sugar for promises, and if an await statement errors it will return a rejected promise, Thus we have this helper function in place that wraps our express routes to handle rejected promises.
 * @returns {Promise}
 */
function asyncMiddleware(routeHandlerCallback) {
    return (req, res, next) => {
        Promise.resolve(routeHandlerCallback(req, res, next))
            .catch(next);
    };
}

module.exports = asyncMiddleware;