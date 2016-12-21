var fs = require('fs');

var addresses = JSON.parse(fs.readFileSync('addresses-recurse.txt'));

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

function meetingType(mt) {
        
        var types=["Big Book", "Beginners", "Closed Discussion", "Step", "Tradition", "Open Meeting", "Open Discussion"]
        var abbr=["BB", "B", "C", "S", "T", "O", "OD"]
        var alt ="";
        
        if (mt==undefined) {mt='';}
        
        for (var i in types) {
            if (mt.includes(types[i])) {
                mt=abbr[i];
                break;
            }
        }
        
        return mt;
    
}

    // Connection URL, use db aa-meetings
    var url = 'mongodb://' + process.env.IP + ':27017/aameetings';

    // Retrieve
    var MongoClient = require('mongodb').MongoClient; // npm install mongodb

    MongoClient.connect(url, function(err, db) {
        
        if (err) {return console.dir(err);}
        
        // avoid dup data in collections
        // var collection = db.collection('finalV12');

        // THIS IS WHERE THE DOCUMENT(S) IS/ARE INSERTED TO MONGO:
        for (var i=0; i < addresses.length; i++) {
            
            collection.insert({
                name: addresses[i].name,
                type: meetingType(addresses[i].type),
                day: addresses[i].day,
                start: tFix(addresses[i].start, addresses[i].end)[0],
                end: tFix(addresses[i].start, addresses[i].end)[1],
                address: addresses[i].address,
                latLong: [addresses[i].lat, addresses[i].lng],
                //added Dec 21
                meetingDetails: [addresses[i].details],
                meetingWheelchair: [addresses[i].wheelchair]
            });
            
        }
        
        console.log("logging collection");
        console.log(collection);
        
        db.close();

    }); //MongoClient.connect
