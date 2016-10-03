var fs = require('fs');
var cheerio = require('cheerio');
var content;

var request = require('request');
var async = require('async'); 

var apiKey = process.env.GMAKEY;

var addresses = [];
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
        
        
         var address = ($(elem)
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

        for (var i = 0; i<meets.length; i++) {
            
            //assign day and time
            if (meets[i] != undefined) {
                var day = meets[i].split('From')[0].replace(/(<([^>]+)>)/ig,'').trim();
                console.log('day: ' + day);
                var time = meets[i].split('From')[1];
                if (time != undefined) time = time.replace(/(<([^>]+)>)/ig,'').trim();
                console.log('time: ' + time);
            }
            
            //assign meeting type
            var type = meets[i+1];
            if (type != undefined) {
                type = type.replace(/(<([^>]+)>)/ig,'').trim();
            }
            
            //assign special interest
            var special = meets[i+2]
            if (special != undefined) {
                if (special.indexOf('Special Interest') != -1) {
                    special = special.replace(/(<([^>]+)>)/ig,'').trim();
                    i += 1;
                }
            }
            i += 1;
            
            // meetings.push({address, day, time, type, special});
        }
        // console.log(meetings[0]);
        
    })
        
}

input();
//console.log(addresses);

// async.eachSeries(addresses, function(value, callback) {
    
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

