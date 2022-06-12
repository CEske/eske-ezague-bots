var express = require('express');
var app = express();
var mysql = require('mysql');
var ajax = require('ajax');

const hostname = '127.0.0.1';
const port = 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/test', function(req, res) {
    res.send('Hello World!');
})

app.get('/getData/:id', function (req, res) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'cortex'
    });
    connection.connect();
    var queryString = 'SELECT * FROM players WHERE id = ?';

    connection.query(queryString, [req.params['id']], (err, data) => {
        if(err) { 
            res.send({ err }) 
        } else {
            res.send({ data });
        }
    });
    connection.end();
});

app.get('/getDiscord/:id', function(req, res) {
    if(req.params['id'] === null) return;
    $.ajax({
        url: `https://discordapp.com/api/users/${req.params['id']}`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bot Nzg3Njc2NjE3NTQyOTkxODkz.X9YbAw.rwQV9Ty9zKjDPwexFbgs5iO-45Q');
        }, success: function(data) {
            console.log(data);
        }
    })
});

app.post('/setData/:id/:perm', function (req, res) {
    if(req.params['id'] === null) return;
    if(req.params['perm'] === null) return;
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'cortex'
    });
    connection.connect();
    var queryString = 'UPDATE players SET permissions = ? WHERE id = ?';

    connection.query(queryString, [req.params['perm'],req.params['id']], (err, data) => {
        if(err) { 
            res.send({ err }) 
        } else {
            res.send("success");
        }
    });
    connection.end();    
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});