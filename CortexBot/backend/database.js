const config = require('./database.json');


var connection;
function handleConnection() {
    connection = require('mysql').createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
    });
    connection.connect(err => { if (err) return setTimeout(handleConnection, 2000) });
    connection.on('error', err => { if (err.code === 'PROTOCOL_CONNECTION_LOST') handleDisconnect(); else throw err });
}
handleConnection()

module.exports = connection;