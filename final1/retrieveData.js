var http = require('http');
var fs = require('fs');
var hb = require('handlebars');

var url = 'mongodb://' + process.env.IP + ':27017/aameetings';
var MongoClient = require('mongodb').MongoClient; // npm install mongodb

var meetings = [];

// Time Formatting
var weekdays = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

var rn      = new Date();
var wdi     = rn.getDay();
var weekday = weekdays[wdi];
var hr      = rn.getHours()-5;

if (hr < 0) { hr = hr+24 };
hr = hr*100;

//basic website
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
        console.log(ms[m]);
        var a = tohtml(ms[m].details[0].name, true);
        // var b = tohtml(weekdaysToNum(ms[m].details[0].day), false);
        var c = tohtml(ms[m].details[0].start, false);
        html += a+c;
    }
    return html;
}

//connect to server
var server = http.createServer(function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) { return console.dir(err); }
        
        var collection = db.collection('finalV2');
        console.log('connected');
        
        collection.aggregate([ 
            
            // https://docs.mongodb.com/manual/tutorial/query-documents/#read-operations-query-argument
            // need to $match to after this time today and 4am tomorrow
            { $match : { start : hr } },
            
            // { $match : { $or : [ { day : weekday, start : { $gt : hr } }, { day : weekdays[wdi+1], start : { $lt : 400 } } ] } },
            // { $group : { _id : "$address", details: { $push: "$$ROOT" } } },
            
            // not working yet { $sort : { start : 1 } }
            
        ]).toArray(function(err, docs) {
            if (err) {console.log(err);}
            else {
                
                for (var i=0; i < docs.length; i++) {
                    meetings.push(docs[i]);
                    // console.log(JSON.stringify(docs[i], null, 4));
                }
                
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(JSON.stringify(meetings)); // showDates(meetings) JSON.stringify(meetings)
            
            } // end else
        
        //close db
        db.close();
        
        }); // end toArray
        
        // console.log(JSON.stringify(meetings));
    
    });
    
    // fs.writeFileSync('aa_data.json', JSON.stringify(meetings));
    
});

server.listen(process.env.PORT);