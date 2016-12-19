//Read table - web server version (assignment 10)
var http = require('http');
var pg = require('pg');
var fs = require('fs');

//login
var un = process.env.PGUSER;
var pw = process.env.PGPW;
var db = process.env.PGDB;
var ep = process.env.PGEP;
var conString = "postgres://" + un + ":" + pw + "@" + ep + "/" + db;


function formatTime(time) {
        
    time = time.split(':');
    var ampm;
        
    time[0] = +time[0];
    if (time[0]>12) {
        time[0] = time[0]-12;
        ampm = 'pm';
    } else {
        ampm = 'am';
    }
        
    time = time[0]+':'+time[1];
    return time+ampm;
}

function avgMaxSpd(result) {
    
    var total = 0;
    var max = 0;
    for (var i in result) {
        //total for avg
        total += result[i].speed;
        //get max
        if (result[i].speed>max) {
            max=result[i].speed;
        }
    }
    var avg = total/result.length;
    
    avg = avg.toFixed(2);
    max = max.toFixed(2);
    
    return [avg, max];
    
}

function duration(result) {
    
    //calc diff
    var d = result[result.length-1].datecreated.getTime()-result[0].datecreated.getTime();
    
    //calc hours min seconds
    var s = d/1000;
    m = Math.floor(s/60);
    s = Math.floor(s%60);
    h = Math.floor(m/60);
    m = Math.floor(m%60);
    var t = [m,s];
    
    //don't display hours if none
    if (h==0) { h=''; } 
    else { h = h+':'; }
    
    //format min / sec
    for (var i in t) {
        if (t[i]<10) { t[i] = '0'+t[i]; } 
        else if (t[i]==0) { t[i] = '00'; }
    }
    
    return h+t.join(':');
    
}

function format(result) {
    
    var t = result[0].datecreated.toString().split(' ');
    var avgmax = avgMaxSpd(result);
    
    //make a new object with meta info
    var meta = new Object();
    meta.startTime = t[1]+' '+t[2]+' '+t[3]+' '+formatTime(t[4]);
    meta.duration = duration(result);
    meta.avgSpd = avgmax[0];
    meta.maxSpd = avgmax[1];
    
    //push meta object to result
    result.push(meta);

    return(JSON.stringify(result));
    
}

//set up to only return speeds less than 50mph to avoid reporting erroneous data
var query = "SELECT * FROM bikespeedotwo WHERE speed < 50;"

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
            response.end(format(result.rows)) //JSON.stringify

            // fs.writeFileSync('sensor_output.json', JSON.stringify(result.rows));

        }); // query

    }); // pg

}); // server

server.listen(process.env.PORT);
