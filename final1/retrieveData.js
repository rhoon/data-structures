var http = require('http');
var fs = require('fs');

var url = 'mongodb://' + process.env.IP + ':27017/aa-meetings';
var MongoClient = require('mongodb').MongoClient; // npm install mongodb

var meetings = [];

var server = http.createServer(function(request, response) {

    // MongoClient.connect
    MongoClient.connect(url, function(err, db) {
        if (err) { return console.dir(err); }
        
        var collection = db.collection('assign5');
        console.log('connected');
        
        collection.aggregate([ 
            
            { $match : { day : "Tuesdays" } },
            
        ]).toArray(function(err, docs) {
        if (err) {console.log(err);}
        else {
            
            for (var i=0; i < docs.length; i++) {
                meetings.push(docs[i])
                // console.log(JSON.stringify(docs[i], null, 4));
                // console.log('');
            }
            
        }
        db.close();
        });
        
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end("Hello, world!");
    
    });
    
    fs.writeFileSync('aa_data.json', JSON.stringify(meetings));
    
});

server.listen(process.env.PORT);