# OneSignalWrapper
## For the EcoTransportCampus Polytech's application

This is a NodeJS module for the Eco Transport Campus application. This module uses the One Signal REST API to send notification to devices.

A server using the One Signal SDK and Wrapper can be found in the example folder.

To install it :

Fetch the repo :
```
git clone https://github.com/amine1996/OneSignalWrapper
cd OneSignalWrapper
npm install
```

Or use npm :
```
npm i onesignalwrapper
```

Use the OneSignalWrapper.js file in your project

To generate doc (JSDoc) : 

For public functions only :
```
jsdoc OneSignalWrapper.js
```
For all functions (including private functions) :
```
jsdoc --private OneSignalWrapper.js
```

To run the example on your server, first set your application id and authorization header in the ./example/data.js file then:

```
cd OneSignalWrapper
npm install
npm install socket.io
cd example
node myServ.js
```

Go to localhost:8080 in your browser.


