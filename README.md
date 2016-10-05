# data-structures
###MSDV Data Structures Assignments

#Assignment 1
Grabs and saves HTML Files

see -> app.js

___

#Assignment 2
Uses Cheerio/Jquery selectors to sort through 

see -> scraper.js

___

#Assignment 3
Update of Scraper.js, uses Google Maps API to locate addresses and writes a txt file with the lat / long JSON objects

see -> scraper.js
    -> addresses.txt
    
___

#Assignment 4
Adds the lat / long data and addresses to a MongoDB collection

***> db.bymeet.find().count() <br />
1870***

see -> assign4.js

___

#Assignment 5
Objects are not writing to array correctly. Console.log returns:
```{ address: '715 West 179th Street, New York, NY',
  day: 'Tuesdays',
  time: '7:30 PM to 8:30 PM',
  type: 'Meeting Type O = Open meeting' }
{ address: '189th Street, New York, NY',
  day: 'Thursdays',
  time: '7:30 PM to 8:30 PM',
  type: 'Meeting Type C = Closed Discussion meeting' }
{ address: '178 Bennett Avenue, New York, NY',
  day: 'Sundays',
  time: '6:00 PM to 7:00 PM',
  type: 'Meeting Type C = Closed Discussion meeting' }
{ address: '178 Bennett Avenue, New York, NY',
  day: 'Mondays',
  time: '7:30 PM to 8:30 PM',
  type: 'Meeting Type BB = Big Book meeting' }```
  
But in the array to store these, they appear reshuffled or all as the same

<br />

see -> scraper.js
