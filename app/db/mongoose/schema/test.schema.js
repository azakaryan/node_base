"use strict";

const mongoose = require('mongoose');


/**
 * @description Define the schema for our Test model.
 */
const test = mongoose.Schema({
    test_id: {type: String, required: true},
    tests: [{}],
}, {strict: true});


/**
 * @description Create the model for Test and expose it to our app.
 */
module.exports = mongoose.model('test', test);