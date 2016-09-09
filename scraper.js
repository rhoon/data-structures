var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/data-01.txt');

var $ = cheerio.load(content);

$('td').each(function(i, elem) {
    if ($(elem).css("border-bottom") == "1px solid #e3e3e3" && $(elem).css("width") == "260px") {

            var almostAddress = $(elem).text();
            var textFieldLength = almostAddress.length;
            var address = '';
            
            var isAddress = false;
            var zipCode = [];
            
            for (var j = 0; j < textFieldLength; j++) {
                
                // assess if this is the address by seeing if the address has started (it starts with a street number) 
                // and has not ended (it ends with a zipcode)
                if (isNumeric(almostAddress[j]) && zipCode.length < 5) {
                    isAddress = true;
                    zipCode.push(almostAddress[j]);
                } 
                
                // 
                // if (isAddress) {
                // address.push(almostAddress[j]);
                // }
                
                console.log(zipCode);
            
            }

    }
})

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}