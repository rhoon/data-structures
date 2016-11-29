//Read table - web server version (assignment 10)
var http = require('http');
var pg = require('pg');
var fs = require('fs');

//login
var un = '';
var pw = '';
var db = '';
var ep = '';
var conString = "postgres://" + un + ":" + pw + "@" + ep + "/" + db;

//data includes time and speed, could be used to calc acceleration later
var createTableQuery = "CREATE TABLE bikespeedotwo (dateCreated timestamp DEFAULT current_timestamp, speed real);"
var insertIntoQuery = "INSERT INTO bikespeedotwo VALUES (DEFAULT, 0);"
var query = "SELECT * FROM bikespeedotwo;"
var complexQuery = "SELECT sum(amount) as total FROM bikespeedotwo GROUP BY DEFAULT;"

var server = http.createServer(function(request, response) {
    console.log('server started');

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
            // console.log(result);
            response.writeHead(200, {'content-type': 'application/json'});
            response.end(JSON.stringify(result.rows))

            fs.writeFileSync('sensor_output.json', JSON.stringify(result.rows));

        }); // query

    }); // pg

}); // server

server.listen(3000, function(){
  console.log('listening on *:3000');
});
