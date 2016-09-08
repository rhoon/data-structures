var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/data-01.txt');

var $ = cheerio.load(content);

// Print to console: all reading assignments
$('td').each(function(i, elem) {
    if ($(elem).css("border-bottom") == "1px solid #e3e3e3" && $(elem).css("width") == "260px") {
        // $(elem).next().find('li').each(function(i, elem) {
            console.log($(elem).text());
        // });
    }
})