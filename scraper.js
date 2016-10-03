var fs = require('fs');
var cheerio = require('cheerio');
var content;

var request = require('request');
var async = require('async'); 

var apiKey = process.env.GMAKEY;

var nyc = ", New York, NY";

var meetings = [];

var meetingsData = [];

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
            
        var meets = $(elem).find('td').eq(1)
            .html()
            .replace(/>\s+</g, "><") //reg ex removes white space (SO) 
            .trim()
            .split('<br>'); 
            
        meets = meets.filter(function(n) {  return n != ''; }); // removes array values containing only white space
        // console.log(meets);
        
        for (var i = 0; i<meets.length; i++) {

            //assign day and time
            if (meets[i] != undefined) {
                meeting.day = meets[i].split('From')[0].replace(/(<([^>]+)>)/ig,'').trim();
                // console.log('day: ' + meeting.day);
                meeting.time = meets[i].split('From')[1];
                if (meeting.time != undefined) meeting.time = meeting.time.replace(/(<([^>]+)>)/ig,'').trim();
            }
            
            //assign meeting type
            meeting.type = meets[i+1];
            if (meeting.type != undefined) {
                meeting.type = meeting.type.replace(/(<([^>]+)>)/ig,'').trim();
            }
            
            //assign special interest, but only if there is one
            var special = meets[i+2];
            if (special != undefined) {
                if (special.indexOf('Special Interest') != -1) {
                    meeting.special = special.replace(/(<([^>]+)>)/ig,'').trim();
                    i += 1;
                }
            }
            console.log(meeting);
            i += 1;
            // add meeting object to array -- meetings array is only pushed a single value
            meetings.push(meeting);
        }
    })
}

// run input, which calls the scraper.
input();
// console.log(meetings);  

// async.eachSeries(meetings, function(value, callback) {
    
//     var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + apiKey;
//     var thisMeeting = new Object;
//     thisMeeting.address = value;
//     request(apiRequest, function(err, resp, body) {
//         if (err) {throw err;}
//         console.log('Im running');
//         thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
//         meetingsData.push(thisMeeting);
//     });
//     setTimeout(callback, 1000);
    
// }, function() {
//     console.log(meetingsData);
//     fs.writeFile('addresses.txt', JSON.stringify(meetingsData), function(err) {
//         if (err) {throw err;}
//         console.log("done");
//     });
// });

