var mysql = require('mysql');
var config = require('./config')
var connection = mysql.createConnection(config.development);
module.exports = connection;