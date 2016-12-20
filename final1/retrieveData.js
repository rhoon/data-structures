var http = require('http');
var fs = require('fs');
var hb = require('handlebars');

var url = 'mongodb://' + process.env.IP + ':27017/aameetings';
var MongoClient = require('mongodb').MongoClient; // npm install mongodb

var meetings = [];

var index1 = fs.readFileSync("index1.txt");
var index3 = fs.readFileSync("index3.txt");

// Time formatting for today
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

//re-format/fix times for UI
function timeOut(t) {
    
    var ampm = 'am';
    var hrOut = Math.floor(t/100)*100;
    var minOut = t - hrOut;
    if (minOut == 0) {
        minOut = '00';
    }
    hrOut = hrOut/100;
    
    if (hrOut > 12) {
        hrOut = hrOut - 12;
        ampm = 'pm';
    }
    
    return hrOut+':'+minOut+' '+ampm;
    
}

//connect to server
var server = http.createServer(function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) { return console.dir(err); }
        
        var collection = db.collection('finalV10');
        console.log('connected');
        
        collection.aggregate([ 
            
            // https://docs.mongodb.com/manual/tutorial/query-documents/#read-operations-query-argument
            // need to $match to after this time today and 4am tomorrow
            // { $match : { day : wdi } } // basic query 
            
            { $match : { $or : [ { day : wdi, start : { $gt : hr } }, { day : wdi+1, start : { $lt : 400 } } ] } },
            
            // { $group : { _id : { latLong : "$latLong", address: "$address"}, details: { $push: "$$ROOT" } } }, // $sort : { start : 1 }
            
            // group by meeting group
            { $group : { _id : {
                latLong : "$latLong",
                meetingName : "$name",
                meetingAddress1 : "$address"
                },
                    meetingDay : { $push : "$day" },
                    meetingStartTime : { $push : "$start" }, 
                    meetingType : { $push : "$type" }
                } // _id
            }, // $group
            
            // group meeting groups by latLong
            {
                $group : { _id : { 
                    latLong : "$_id.latLong"},
                    meetingGroups : { $push : { 
                        groupInfo : "$_id", 
                        meetingDay : "$meetingDay", 
                        meetingStartTime : "$meetingStartTime", 
                        meetingType : "$meetingType" 
                    }}
                }
            }
            
        ]).toArray(function(err, docs) {
            if (err) {console.log(err);}
            else {
                
                for (var i=0; i < docs.length; i++) {
                    meetings.push(docs[i]);
                    // console.log(JSON.stringify(docs[i], null, 4));
                }
                
                res.writeHead(200, { "Content-Type" : "text/html" });
                res.write(index1);
                res.write(JSON.stringify(meetings)); // JSON.stringify(meetings)
                res.end(index3);
            
            } // end else
        
        //close db
        db.close();
        
        }); // end toArray
        
        // console.log(JSON.stringify(meetings));
    
    });
    
    // fs.writeFileSync('aa_data.json', JSON.stringify(meetings));
    
});

server.listen(process.env.PORT);