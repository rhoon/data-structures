var fs = require('fs');
var cheerio = require('cheerio');
var content;

var request = require('request');
var async = require('async'); 

var apiKey = process.env.GMAKEY;

var addresses = [];
var nyc = ", New York, NY";

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
         addresses.push($(elem)
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
        })
}

input();
//console.log(addresses);

async.eachSeries(addresses, function(value, callback) {
    
    var apiRequest = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + value.split(' ').join('+') + '&key=' + apiKey;
    var thisMeeting = new Object;
    thisMeeting.address = value;
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        console.log('Im running');
        thisMeeting.latLong = JSON.parse(body).results[0].geometry.location;
        meetingsData.push(thisMeeting);
    });
    setTimeout(callback, 1000);
    
}, function() {
    console.log(meetingsData);
    fs.writeFile('addresses.txt', JSON.stringify(meetingsData), function(err) {
        if (err) {throw err;}
        console.log("done");
    });
});

