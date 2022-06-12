var config = require('./database.json');


var db_config = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
};

var connection;

function handleConnection() {
    connection = require('mysql').createConnection(db_config);
    connection.connect(err => { if (err) return setTimeout(handleConnection, 2000) });
    connection.on('error', err => { if (err.code === 'PROTOCOL_CONNECTION_LOST') handleConnection(); else throw err });
}
handleConnection()

module.exports = connection;