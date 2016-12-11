var http = require('http');
var fs = require('fs');
var hb = require('handlebars');

var url = 'mongodb://' + process.env.IP + ':27017/aameetings';
var MongoClient = require('mongodb').MongoClient; // npm install mongodb

var meetings = [];
var hello = 'Hello World';

var rn = new Date();
var today = rn.getDay(); //returns 0 (sunday) - 6 (saturday)
var hourRangeStart = rn.getHours(); //returns 0-23 UTC (5hrs ahead of NYC)

// var hourRangeEnd = hourRangeStart

// console.log(day, hourRangeStart);

//http://www.w3schools.com/js/js_switch.asp
//for reverse version of below

function weekdaysToNum(weekday) {
    
    var num;
    switch (weekday) {
        case "Sundays":
            num = 0;
            break;
        case "Mondays":
            num = 1;
            break;
        case "Tuesdays":
            num = 2;
            break;
        case "Wednesdays":
            num = 3;
            break;
        case "Thursdays":
            num = 4;
            break;
        case "Fridays":
            num = 5;
            break;
        case "Saturdays":
            num = 6;
    }
    return num;
    
}

function tohtml(str, h1) {
    
    if (h1) {
      return "<h1>"+str+"</h1>"; 
    } else {
      return "<p>"+str+"</p>";
    }
    
}

function showDates(ms) {
    
    var html;
    for (var m in ms) {
        
        var a = tohtml(ms[m].type, true);
        var b = tohtml(weekdaysToNum(ms[m].day), false);
        var c = tohtml(ms[m].start, false);
        html += a+b+c;
        
    }
    return html;
    
}

var h1 = "<h1 style='font-family: sans-serif'>HI I'M HTML</h1>";

//connect to server
var server = http.createServer(function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) { return console.dir(err); }
        
        var collection = db.collection('finalV1');
        console.log('connected');
        
        collection.aggregate([ 
            
            // https://docs.mongodb.com/manual/tutorial/query-documents/#read-operations-query-argument
            // need to $match to after this time today and 4am tomorrow
            // tester: { $or : [ { day : "Tuesdays", start : { $gt : 1500 } }, { day : "Wednesdays", start : { $lt : 400 } } ] }
            // 
            { $match : { $or : [ { day : "Tuesdays", start : { $gt : 1500 } }, { day : "Wednesdays", start : { $lt : 400 } } ] } },
            { $group : { _id : "$address", details: { $push: "$$ROOT" } } }
            
        ]).toArray(function(err, docs) {
            if (err) {console.log(err);}
            else {
                
                for (var i=0; i < docs.length; i++) {
                    meetings.push(docs[i]);
                    // console.log(JSON.stringify(docs[i], null, 4));
                    // console.log('');
                    
                }
                
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(JSON.stringify(meetings)); // showDates(meetings)
            
            } // end else
        
        //close db
        db.close();
        
        }); // end toArray
        
        // console.log(JSON.stringify(meetings));
    
    });
    
    // fs.writeFileSync('aa_data.json', JSON.stringify(meetings));
    
});

server.listen(process.env.PORT);