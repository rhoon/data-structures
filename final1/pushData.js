var fs = require('fs');

var addresses = JSON.parse(fs.readFileSync('addresses.txt'));

var weekdays = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

function weekdaysToNum(weekday) {
    
    var num = 0;
    
    for (var i in weekdays) {
        if (weekday == weekdays[i]) {
            num = i;
            break;
        }
    }
    
    return +num;
    
}

//fix error in time introduced in scraper
function tFix(startTime, endTime) {
    
    if (startTime > endTime && startTime >= 2400) {
        startTime = startTime - 1200;
        console.log('tFix start'+startTime);
    } else if (startTime < 1200 && endTime >= 2400) {
        endTime = endTime - 1200;
        console.log('tFix end'+endTime);
    }
    
    
    return [startTime, endTime]
    
}

    // Connection URL, use db aa-meetings
    var url = 'mongodb://' + process.env.IP + ':27017/aameetings';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb

    MongoClient.connect(url, function(err, db) {
        
        if (err) {return console.dir(err);}
        
        // use collection 'assign5'
        var collection = db.collection('finalV4');

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        for (var i=0; i < addresses.length; i++) {
            
            collection.insert({
                name: addresses[i].name,
                type: addresses[i].type,
                day: weekdaysToNum(addresses[i].day),
                start: tFix(addresses[i].start, addresses[i].end)[0],
                end: tFix(addresses[i].start, addresses[i].end)[1],
                address: addresses[i].address,
                lat: addresses[i].lat,
                lng: addresses[i].lng
            });
            
        }
        console.log("logging collection");
        console.log(collection);
        
        db.close();

    }); //MongoClient.connect
