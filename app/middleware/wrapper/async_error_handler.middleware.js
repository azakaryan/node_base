"use strict";

/**
 * @type 1
 * @access public
 * @param array of async middlewares
 * @description - Since Async Await is essentially syntactic sugar for promises, and if an await statement errors it will return a rejected promise, Thus we have this helper function in place that wraps our express routes to handle rejected promises.
 * @returns {Promise}
 */
function asyncMiddleware(...args) {
    return args.map(routeHandlerMiddleware => {
        return (req, res, next) => {
            Promise.resolve(routeHandlerMiddleware(req, res, next))
                .catch(next);
        };
    });
}

module.exports = asyncMiddleware;
