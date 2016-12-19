// Time Parsing
var weekdays = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
var rn = new Date();
var wdi = rn.getDay();
var weekday = weekdays[wdi];
var hr = rn.getHours()-5;

if (hr < 0) { hr = hr+24 };

console.log('RN');
console.log(rn);
console.log(weekday);
console.log('HOUR')
console.log(hr);

//hour minus 5
//if negative, add 24
