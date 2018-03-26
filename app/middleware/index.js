'use strict';

module.exports.Account = require('./wrapper/account.middleware');
module.exports.AccountUsers = require('./wrapper/account_users.middleware');
module.exports.Admin = require('./wrapper/admin.middleware');
module.exports.AsyncErrorHandler = require('./wrapper/async_error_handler.middleware');
module.exports.Password = require('./wrapper/password.middleware');
module.exports.User = require('./wrapper/user.middleware');