var fs = require('fs');

var addresses = JSON.parse(fs.readFileSync('addresses.txt'));

    // Connection URL, use db aa-meetings
    var url = 'mongodb://' + process.env.IP + ':27017/aameetings';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb

    MongoClient.connect(url, function(err, db) {
        
        if (err) {return console.dir(err);}
        
        // use collection 'assign5'
        var collection = db.collection('assign5');

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        for (var i=0; i < addresses.length; i++) {
            collection.insert({
                type: addresses[i].type,
                day: addresses[i].day,
                start: addresses[i].start,
                end: addresses[i].end,
                address: addresses[i].address,
                lat: addresses[i].lat,
                lng: addresses[i].lng
            });
        }
        console.log("logging collection");
        console.log(collection);
        
        db.close();

    }); //MongoClient.connect
