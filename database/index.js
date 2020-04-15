var mysql = require('mysql');
var config = require('../config/config')
var connection = mysql.createConnection(config.development);
module.exports = connection;