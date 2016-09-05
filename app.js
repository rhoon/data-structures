var request = require('request');  // load module
var fs = require('fs');

function dataWriter(i) {
  
  if (i < 11) { 
    
    // set fileNum var to avoid error on single -> double digit
    var fileNum;
     if ( i < 10 ) {
       fileNum = '0' + i;
     } else {
       fileNum = i;
     }
       
    request('http://visualizedata.github.io/datastructures/data/m'+fileNum+'.html', function (error, response, body) {
     if (!error && response.statusCode == 200) {
       
       // write output
       console.log('/home/ubuntu/workspace/data/data-'+fileNum+'.txt');
       fs.writeFileSync('/home/ubuntu/workspace/data/data-'+fileNum+'.txt', body);
       
       //callback
       dataWriter(i+1)
     }
     else {console.error('request failed')}
    
    })
  }
}

dataWriter(1);