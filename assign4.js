var fs = require('fs');

var addresses = JSON.parse(fs.readFileSync('addresses.txt'));

    // Connection URL, use db aa-meetings
    var url = 'mongodb://' + process.env.IP + ':27017/aa-meetings';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb

    MongoClient.connect(url, function(err, db) {
        
        if (err) {return console.dir(err);}
        
        // use collection 'bymeet'
        var collection = db.collection('bymeet');

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        for (var i=0; i < addresses.length; i++) {
            collection.insert({
                address: addresses[i].address,
                latLong: addresses[i].latLong
            });
        }
        console.log("logging collection");
        console.log(collection);
        
        db.close();

    }); //MongoClient.connect
