var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/data-01.txt');

var $ = cheerio.load(content);

$('td').each(function(i, elem) {
    if ($(elem).css("border-bottom") == "1px solid #e3e3e3" && $(elem).css("width") == "260px") {
        var a = $(elem).contents().filter(function() {
                    return this.nodeType == 3;
                }).text();
        console.log(a);
    }
})