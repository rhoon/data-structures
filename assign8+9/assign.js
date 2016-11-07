//Arduino Infrared Bike Speedometer
var five = require("johnny-five");
var pg = require('pg');

//postgres
var un = '';
var pw = '';
var db = '';
var ep = 'bikespeedo.cna8vsdyhszb.us-west-2.rds.amazonaws.com:5432';
var conString = "postgres://" + un + ":" + pw + "@" + ep + "/" + db;

//data includes time and speed, could be used to calc acceleration later
var createTableQuery = "CREATE TABLE bikespeedotwo (dateCreated timestamp DEFAULT current_timestamp, speed real);"
var insertIntoQuery = "INSERT INTO bikespeedotwo VALUES (DEFAULT, 0);"
var query = "SELECT * FROM bikespeedotwo;"
var complexQuery = "SELECT sum(amount) as total FROM bikespeedotwo GROUP BY DEFAULT;"

//init Arduino/J5
var board = new five.Board();

var led, reciever, previous;

board.on("ready", function() {

  led = new five.Led(5); // LED Pin 5
  reciever = new five.Button(2); // IR sensor Pin 2
  lastSpinTime = 0;

  setInterval( () => { ledON() }, 1);

  reciever.on('release', function() {
    //get current times
    var thisSpinTime = new Date;
    var delta = thisSpinTime.getTime() - lastSpinTime;
    // console.log(delta);

    // calculate speed
    var bikeWheel = 0.001329373956; //miles
    // milliseconds to hours: 2.77778e-7
    var speed = bikeWheel/(delta*2.77778e-7);
    console.log('CURRENT SPEED: '+speed);
    insertIntoQuery = 'INSERT INTO bikespeedotwo VALUES (DEFAULT, '+speed+');'

    //insert data
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(insertIntoQuery, function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if (err) {
                return console.error('error running query', err);
            }
            console.log(result);
        });

    });

    lastSpinTime = thisSpinTime.getTime();
  });

});

//thanks for the help, Gentry!
var ledON = (microseconds) => {
  //~38kh
  led.on();
  microseconds -= 13;
  if(microseconds > 0){
    setTimeout(()=>{ ledOFF(microseconds) }); //on for 13 microseconds
  }
}

var ledOFF = (microseconds) => {
  //~38kh
  led.off();
  microsecons -= 13;
  setTimeout( () => { ledON(microseconds) }); //off for 13 microseconds
}
