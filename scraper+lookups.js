var _ = require('lodash');

var fs = require('fs');
var cheerio = require('cheerio');
var content;

var request = require('request');
var async = require('async'); 

var apiKey = process.env.GMAKEY;

var latsAndLongs = JSON.parse(fs.readFileSync('addresses.txt'));

var nyc = ", New York, NY";
var meetings = [];
var weekdays = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

var count = 0;

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

// takes string formatted in 12:00 AM / PM and makes it into a miltary time
function militaryTime(time) {
    
    var hours = time.split(' ')[0].split(':')[0];
    hours = +hours;
    var minutes = time.split(' ')[0].split(':')[1];
    var PM = time.split(' ')[1].toUpperCase();
    if (PM == 'PM' && hours != 12) {
        hours = hours+12;
    } else if (hours == 12 && PM != 'PM') { 
        hours = 0; 
    }
    return parseInt(hours + minutes);
    
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
var ri = 1;
function input() {
    
        if (ri<=10) {
            if (ri<=9) {
                s = '0' + ri;
            } else {
                s = ri;
            }
            content = fs.readFileSync('data/data-'+s+'.txt');
            scrape(content);
            ri++;
            input();
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
            
        //assign details
        meeting.details = $(elem).find('div.detailsBox').text().trim();

        //assign wheelchair access 
        meeting.wheelchair = $(elem).text().includes('Wheelchair access');

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
        
        //parse second td for multiple meetings
        var meets = $(elem).find('td').eq(1)
            .html()
            .replace(/>\s+</g, "><") //reg ex removes white space (SO) 
            .trim()
            .split('<br>'); 
        
        // removes array values containing only white space
        meets = meets.filter(function(n) {  return n != ''; }); 
        console.log(meets);
        
        async.forEachOf(meets, function (value, i, callback) {

            console.log(meets[i]);
            //assign day and time
            if (meets[i] != undefined) {
                meeting.day = meets[i].split('From')[0].replace(/(<([^>]+)>)/ig,'').trim();
                console.log(meeting.day);
                meeting.day = weekdaysToNum(meeting.day);
                console.log(meeting.day);

                var time = meets[i].split('From')[1];
                console.log(time);
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

            findLatLong(meeting);
            
            console.log('COUNT: '+count);
            count++;
            
            // add meeting object to array -- meetings array is only pushed a single value
            meetings.push(meeting);
            
            callback();
            
        }, function() {
            console.log('meets');
        });
    })
}

function findLatLong(m) {
    
    for (var l in latsAndLongs) {
        
        if (latsAndLongs[l].name == m.name && latsAndLongs[l].address == m.address) {
            console.log('MATCH');
            console.log(latsAndLongs[l].name+' : '+m.name);
            console.log(latsAndLongs[l].address+' : '+m.address);
            m.lat = latsAndLongs[l].lat;
            m.lng = latsAndLongs[l].lng;
            break;
        }
        
    }
}

// run input, which calls the scraper.
input();
// console.log(meetings);  

// No API - trying lookups instead

// fs.writeFile('addresses-2.txt', JSON.stringify(meetings), function(err) {
//         if (err) {throw err;}
//         console.log("done");
//     });

