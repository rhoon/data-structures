var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('data/data-01.txt');
var $ = cheerio.load(content);

var request = require('request');
var async = require('async'); 

var apiKey = process.env.GMAKEY;

var addresses = [];
var nyc = ", New York, NY";

var meetingsData = [];

$('tbody').find('tr').each(function(i, elem) {
     addresses.push($(elem)
        .find('td')
        .eq(0).html().split('<br>')[2]
        .split(',')[0]
        .split('(')[0]
        .split('-')[0]
        .trim()
        .concat(nyc)); //.replace(/ /g, '+'));
    })

console.log(addresses);

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

