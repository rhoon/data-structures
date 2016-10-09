var fs = require('fs');
var cheerio = require('cheerio');
var content;

var request = require('request');
var async = require('async'); 

var apiKey = process.env.GMAKEY;

var nyc = ", New York, NY";

var meetings = [];

// var meetingsData = [];

function weekdayToNum(weekday) {
    
    
}

// takes string formatted in 12:00 AM / PM and makes it into a miltary time
function militaryTime(time) {
    
    var hours = time.split(' ')[0].split(':')[0];
    hours = +hours;
    var minutes = time.split(' ')[0].split(':')[1];
    var PM = time.split(' ')[1].toUpperCase();
    console.log(PM);
    if (PM == 'PM') {
        hours = hours+12;
    } else if (hours == 12) { 
        hours = 0; 
    }
    
    console.log(hours + minutes);
    
}

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

function scrape(content) { 
    
    var $ = cheerio.load(content);
    
    $('tbody').find('tr').each(function(i, elem) {
        
        //make the meeting (SINGULAR) object 
         var meeting = new Object;
        
        //assign the address
         meeting.address = ($(elem)
            .find('td')
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
                // console.log('day: ' + meeting.day);
                var time = meets[i].split('From')[1];
                if (time != undefined) {
                    meeting.start = time.split('to')[0].replace(/(<([^>]+)>)/ig,'').trim();
                    meeting.end = time.split('to')[1].replace(/(<([^>]+)>)/ig,'').trim();
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
// console.log(meetings);  

// async.eachSeries(meetings, function(item, callback) {
    
//     var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + item.address.split(' ').join('+') + '&key=' + apiKey;
//     var thisMeeting = new Object;
//     thisMeeting.address = item.address;  //so this is declaring a new object. can it work with the old object, meetings?
    
//     request(apiRequest, function(err, resp, body) {  
//         if (err) {throw err;} 
//         console.log(thisMeeting.address);
//         thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;  
//         console.log(item.latLong);
//         meetings.push(thisMeeting);
//     });
//     setTimeout(callback, 250);
    
// }, function() {
//     console.log(meetings);
//     fs.writeFile('addresses.txt', JSON.stringify(meetings), function(err) {
//         if (err) {throw err;}
//         console.log("done");
//     });
// });

