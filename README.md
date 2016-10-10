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
Updated 10/10/2016

```
> db.assign5.aggregate( [ 
...   { $match : { $and: [ { day : "Tuesdays" }, { start : { $gte: 1900 } } ] } } 
... ] );
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee2b"), "type" : "Beginners meeting", "day" : "Tuesdays", "start" : 2415, "end" : 1315, "address" : "49 Fulton Street, New York, NY", "lat" : 40.7081354, "lng" : -74.00394519999999 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee32"), "type" : "Closed Discussion meeting", "day" : "Tuesdays", "start" : 1945, "end" : 2045, "address" : "283 West Broadway, New York, NY", "lat" : 40.7208017, "lng" : -74.0048389 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee3e"), "type" : "Closed Discussion meeting", "day" : "Tuesdays", "start" : 1900, "end" : 2000, "address" : "141 Henry Street, New York, NY", "lat" : 40.7134775, "lng" : -73.9906663 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee4a"), "type" : "Closed Discussion meeting", "day" : "Tuesdays", "start" : 2000, "end" : 2100, "address" : "81 Christopher Street, New York, NY", "lat" : 40.7336975, "lng" : -74.0035917 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee67"), "type" : "Open meeting", "day" : "Tuesdays", "start" : 2000, "end" : 2100, "address" : "229 West 14th Street, New York, NY", "lat" : 40.7393643, "lng" : -74.00081270000001 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee6a"), "type" : "Step meeting", "day" : "Tuesdays", "start" : 1900, "end" : 2000, "address" : "28 Gramercy Park South, New York, NY", "lat" : 40.7370361, "lng" : -73.9853871 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee6e"), "type" : "Step meeting", "day" : "Tuesdays", "start" : 1900, "end" : 2000, "address" : "80 St, New York, NY", "lat" : 40.7740246, "lng" : -73.954563 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee77"), "type" : "Closed Discussion meeting", "day" : "Tuesdays", "start" : 2000, "end" : 2100, "address" : "19 Union Square West, New York, NY", "lat" : 40.7361079, "lng" : -73.991242 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee7e"), "type" : "Closed Discussion meeting", "day" : "Tuesdays", "start" : 1915, "end" : 2030, "address" : "12 West 12th Street, New York, NY", "lat" : 40.734504, "lng" : -73.995177 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee87"), "type" : "Open Discussion meeting", "day" : "Tuesdays", "start" : 1900, "end" : 2000, "address" : "10 East Union Square, New York, NY", "lat" : 40.7347942, "lng" : -73.98953209999999 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee88"), "type" : "Open Discussion meeting", "day" : "Tuesdays", "start" : 2100, "end" : 2200, "address" : "206-208 East 11th Street, New York, NY", "lat" : 40.7308882, "lng" : -73.9881049 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee95"), "type" : "Big Book meeting", "day" : "Tuesdays", "start" : 1930, "end" : 2030, "address" : "602 East 9th Street, New York, NY", "lat" : 40.7260263, "lng" : -73.9801554 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddee9c"), "type" : "Step meeting", "day" : "Tuesdays", "start" : 2115, "end" : 2230, "address" : "303 West 42nd Street, New York, NY", "lat" : 40.7576553, "lng" : -73.9899274 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddeea3"), "type" : "Open meeting", "day" : "Tuesdays", "start" : 2000, "end" : 2100, "address" : "446 West 33rd Street, New York, NY", "lat" : 40.7535422, "lng" : -73.9987837 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddeea4"), "type" : "Closed Discussion meeting", "day" : "Tuesdays", "start" : 2115, "end" : 2215, "address" : "252 West 46th Street, New York, NY", "lat" : 40.7593263, "lng" : -73.98727389999999 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddeeae"), "type" : "Open Discussion meeting", "day" : "Tuesdays", "start" : 2430, "end" : 1330, "address" : "422 West 57th Street, New York, NY", "lat" : 40.7681523, "lng" : -73.986936 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddeeaf"), "type" : "Open Discussion meeting", "day" : "Tuesdays", "start" : 2430, "end" : 1330, "address" : "7 West 55th Street, New York, NY", "lat" : 40.76208099999999, "lng" : -73.9752496 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddeeb4"), "type" : "Big Book meeting", "day" : "Tuesdays", "start" : 1930, "end" : 2030, "address" : "303 West 42nd Street, New York, NY", "lat" : 40.7576553, "lng" : -73.9899274 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddeeb6"), "type" : "Big Book meeting", "day" : "Tuesdays", "start" : 2400, "end" : 1300, "address" : "307 West 26th Street, New York, NY", "lat" : 40.7476699, "lng" : -73.9975237 }
{ "_id" : ObjectId("57fbaa35ac36c74e03ddeebf"), "type" : "Open Discussion meeting", "day" : "Tuesdays", "start" : 2430, "end" : 1330, "address" : "1 West 53rd Street, New York, NY", "lat" : 40.76083209999999, "lng" : -73.9763834 }
Type "it" for more
```
  

<br />

see -> scraper.js, assign5.js

___

#Assignment 5
Enhanced scraper now adds meeting titles with improved formatting

see -> scraper.js