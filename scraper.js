var _ = require('lodash');

var fs = require('fs');
var cheerio = require('cheerio');
var content;

var request = require('request');
var async = require('async'); 

var apiKey = process.env.GMAKEY;

var nyc = ", New York, NY";

var meetings = [];

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

// takes string formatted in 12:00 AM / PM and makes it into a miltary time
function militaryTime(time) {
    
    console.log(time);
    
    var hours = time.split(' ')[0].split(':')[0];
    hours = +hours;
    var minutes = time.split(' ')[0].split(':')[1];
    var PM = time.split(' ')[1].toUpperCase();
    if (PM == 'PM' && hours != 12) {
        hours = hours+12;
    } else if (hours == 12 && PM != 'PM') { 
        hours = 0; 
    }
    // console.log(hours+minutes);
    return parseInt(hours + minutes);
    
}

// removes adjacent duplicates
function rmDups(array) {
    
    for (var i=0; i<array.length; i++) {
        if (_.isEqual(array[i], array[i+1])) {
            array.splice(i,1);
            i--;
        } 
    }
    
}

// meeting.name scrubber
function nameScrub(name) {
    name = name.toUpperCase();
    
    var one = name.indexOf(':I');
    var altOne = name.indexOf(':1');
    var two = name.indexOf(':II');
    var three = name.indexOf(':III');
    
    if (one != -1 || altOne != -1) {
    	name = name.split('(')[0].trim() + ' 1';
    } else if (two != -1) {
        name = name.split('(')[0].trim() + ' 2';
    } else if (three != -1) {
        name = name.split('(')[0].trim() + ' 3';
    }
    
    name = name.replace('&APOS;', '‘').replace('&AMP;', '&');

    return name;
}

// loop through files
function input() {
    for (var i=1; i<=10; i++) {
        if (i<=9) {
            s = '0' + i;
        } else {
            s = i;
        }
        content = fs.readFileSync('data/data-'+s+'.txt');
        scrape(content);
    }
}

// get content & build objects
function scrape(content) { 
    
    var $ = cheerio.load(content);
    
    $('tbody').find('tr').each(function(i, elem) {
        
        //make the meeting (SINGULAR) object 
         var meeting = new Object;
         
         //assign the name
         meeting.name = nameScrub(($(elem).find('td')
            .eq(0).html()
            .split('<br>')[1])
            .split('-')[0]
            .replace(/(<([^>]+)>)/ig,'')
            .trim());

        // console.log(meeting.name);
        
        //assign the address
         meeting.address = ($(elem).find('td')
            .eq(0).html().split('<br>')[2]
            .split(',')[0]
            .split('(')[0]
            .split('@')[0]
            .replace('W.', 'West') // sub words for letters
            .replace('E.', 'East') // so period 'split' works (next line)
            .split('.')[0]
            .split('- ')[0]
            .split('&amp;')[0]
            .trim()
            .concat(nyc)); //.replace(/ /g, '+'));
        
        //for some reason google doesn't like these addresses
        if (meeting.address.indexOf('Hudson Street,')!=-1) {
            meeting.address = '487 Hudson, New York, NY';
        } else if (meeting.address.indexOf('127 East 22nd Street')!=-1) {
            meeting.address = '127 E 22nd St, New York, NY 10010';
        }
        
        //parse second td for multiple meetings
        var meets = $(elem).find('td').eq(1)
            .html()
            .replace(/>\s+</g, "><") //reg ex removes white space (SO) 
            .trim()
            .split('<br>'); 
        
        // removes array values containing only white space
        meets = meets.filter(function(n) {  return n != ''; }); 
        // console.log(meets);
        
        for (var i = 0; i<meets.length; i++) {

            //assign day and time
            if (meets[i] != undefined) {
                meeting.day = meets[i].split('From')[0].replace(/(<([^>]+)>)/ig,'').trim();
                meeting.day = weekdaysToNum(meeting.day);
                // console.log(meeting.day);
                var time = meets[i].split('From')[1];
                if (time != undefined) {
                    meeting.start = militaryTime(time.split('to')[0].replace(/(<([^>]+)>)/ig,'').trim());
                    meeting.end = militaryTime(time.split('to')[1].replace(/(<([^>]+)>)/ig,'').trim());
                };
                
            }
            
            //assign meeting type
            meeting.type = meets[i+1];
            if (meeting.type != undefined) {
                meeting.type = meeting.type.replace(/(<([^>]+)>)/ig,'').trim().split('= ')[1];
            }
            
            //assign special interest, but only if there is one
            var special = meets[i+2];
            if (special != undefined) {
                if (special.indexOf('Special Interest') != -1) {
                    meeting.special = special.replace(/(<([^>]+)>)/ig,'').trim().replace('Special Interest ', '');
                    i += 1;
                }
            }
            i += 1;
            // add meeting object to array -- meetings array is only pushed a single value
            meetings.push(meeting);
        }
    })
}

// run input, which calls the scraper.
input();
rmDups(meetings);
// console.log(meetings);  

var errCount = 0;
var successCount = 0;

async.eachSeries(meetings, function(item, callback) {
    
    var apiRequest = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + item.address.split(' ').join('+') + '&key=' + apiKey;
    // // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
    
        request(apiRequest, function(err, resp, body) {  
            if (err) {throw err;} 
            
            var jsonbod = JSON.parse(body).results[0];

            if (jsonbod!=undefined) {
                // write the lat and lng to key / value pairs on meetings object
                item.lat = jsonbod.geometry.location.lat;
                item.lng = jsonbod.geometry.location.lng;
                
                console.log('SUCCESS COUNT: '+ successCount);
                successCount++;
                
            } else {
                // return error on undefined bod rather than breaking
                errCount++;
                console.log('UNDEFINED');
                console.log(apiRequest);
                console.log('ERROR COUNT: '+ errCount);
                console.log('SUCCESS COUNT: '+ successCount);
            }
            
        });

    setTimeout(callback, 2000);

    
}, function() {
    console.log(meetings);
    fs.writeFile('addresses.txt', JSON.stringify(meetings), function(err) {
        if (err) {throw err;}
        console.log("done");
    });
});

