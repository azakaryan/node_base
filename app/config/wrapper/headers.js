"use strict";


module.exports = {

    /**
     * @type function
     * @access public
     * @param app
     * @description Set Headers.
     */
    setCrossOriginHeaders(app) {
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");

            req.method === 'OPTIONS' ? res.sendStatus(200) : next();
        });
    }
};