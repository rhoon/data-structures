// PRESS YOUR LUCK button
// https://youtu.be/fnTbO26u9bQ

var pg = require('pg');

// connection string
var un = 'aaron'; // aws db username
var pw = 'kittycat'; // aws db password
var db = 'pressyourluck'; // aws db database name
var ep = 'pressyourluck.c2g7qw1juwkg.us-east-1.rds.amazonaws.com:5432'; // aws db endpoint
var conString = "postgres://" + un + ":" + pw + "@" + ep + "/" + db;

var createTableQuery = "CREATE TABLE wham (message varchar(100) , dateCreated timestamp DEFAULT current_timestamp, whammy boolean, amount smallint);"
var insertIntoQuery = "INSERT INTO wham VALUES ('No whammy!!!', DEFAULT, FALSE, 100);"
var query = "SELECT * FROM wham;"
var complexQuery = "SELECT sum(amount) as total FROM wham GROUP BY whammy;"

pg.connect(conString, function(err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err);
    }

    client.query(query, function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if (err) {
            return console.error('error running query', err);
        }
        console.log(result);
    });

});