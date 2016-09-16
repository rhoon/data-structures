var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/data-01.txt');

var $ = cheerio.load(content);

var addresses = [];

var nyc = ", New York, NY";

$('tbody').find('tr').each(function(i, elem) {
     addresses
        .push($(elem)
        .find('td')
        .eq(0).html().split('<br>')[2]
        .split(',')[0].trim()
        .concat(nyc).replace(/ /g, '+'));
    })

console.log(addresses);


// $('td').each(function(i, elem) {
//     if ($(elem).css("border-bottom") == "1px solid #e3e3e3" && $(elem).css("width") == "260px") {
//         var a = $(elem).contents().filter(function() {
//                     return this.nodeType == 3;
//                 }).text();
                
//         console.log(a);
//     }
// })

// function findJunk(address) {
//     var cutStart;
//     var cutEnd;
    
//     //locate the parentheses
//     for (var i=0; i<address.length; i++) {
//         if (address[i] == '(') {
//             cutStart = i;
//         } else if (address[i] == ')') {
//             cutEnd = i;
//         }
//     }
    
//     //cut 'em on outta there
//     if (cutStart != undefined && cutEnd != undefined) {
//         cut(address, cutStart, cutEnd);
//     } else {
//         console.log(address);
//     }
    
// }

//thanks, stack overflow
function cut(str, cutStart, cutEnd){
  console.log(str.substr(0,cutStart) + str.substr(cutEnd+1));
}