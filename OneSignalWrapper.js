'use strict';

/**
 * A One Signal Wrapper for the EcoTransportCampus Polytech's application.
 * @module OneSignalWrapper
 * @requires {@link https://github.com/request/request}
 * @requires {@link https://github.com/request/request-promise}
 */

 /**
  * Request promise module accessor.
  * @type {request-promise}
  * @private
  */
const reqPromise = require('request-promise');

 /**
  * One Signal Notification API endpoint.
  * @type {string}
  * @private
  */
const notificationEndpoint = "https://onesignal.com/api/v1/notifications";

 /**
  * One Signal Players API endpoint.
  * @type {string}
  * @private
  */

const playerEndpoint = "https://onesignal.com/api/v1/players/";

/**
 * Configure error message
 * @type {string}
 * @private
 */
const configurationError = "This module needs appId and authHeader to be set";

/**
 * One Signal application ID. Configure via configure function.
 * @type {string}
 * @private
 */
let appId;

/**
 * One Signal authorization header. Configure via configure function.
 * @type {string}
 * @private
 */
let authorizationHeader;


/** 
 * Configure the One Signal wrapper with One Signal application ID and authorization header.
 * @param {string} pAppId - One signal application ID  (Get in in your One Signal account)
 * @param {string} pAuthHeader - One signal authorization header. (Get it in your One Signal account)
 * @example
 * //Configure the module to use with your One Signal application
 * configure("YourApplicationId","YourAuthHeaderCode");
 */
exports.configure = function (pAppId, pAuthHeader) {
    appId = pAppId;
    authorizationHeader = pAuthHeader;
}

/**
 * Send a notification to all One Signal devices. (uses the segment All)
 * @param {string} notificationText - Displayed text in the notification
 * @example
 * //Will display a stringified object containing the id of the notification and the number of recipients.
 * sendNotificationToAll("Hello World").then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response
 */
exports.sendNotificationToAll = function (notificationText) {

    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const notificationObject = createSegmentMessage(notificationText, ['All']);

    return createNotificationPromise(notificationObject);   
}

/**
 *  Send a notification targeting one segment.
 * @param {string} notificationText - Displayed text in the notification
 * @param {string} segment - Targeted segment
 * @example
 * //Will display a stringified object containing the id of the notification and the number of recipients.
 * sendNotificationToSegment("Hello World", "TargetedSegment").then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response.
 */
exports.sendNotificationToSegment = function (notificationText, segment) {

    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const notificationObject = createSegmentMessage(notificationText, [segment]);

    return createNotificationPromise(notificationObject);   

}

/**
 *  Send a notification targeting multiple segments.
 * @param {string} notificationText - Displayed text in the notification
 * @param {string[]} segment - Targeted segments
 * @example
 * //Will display a stringified object containing the id of the notification and the number of recipients.
 * sendNotificationToMultSegments("Hello World", ["All","TargetedSegments"]).then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response.
 */
exports.sendNotificationToMultSegments = function (notificationText, segments) {

    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const notificationObject = createSegmentMessage(notificationText, segments);

    return createNotificationPromise(notificationObject);   

}

/**
 *  Send a notification to a single One Signal device.
 * @param {string} notificationText - Displayed text in the notification
 * @param {string} id - Player ID of the targeted device
 * @example
 * //Will display a stringified object containing the id of the notification and the number of recipients.
 * sendNotificationToID("Hello World", "oneUserDeviceId").then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response.
 */
exports.sendNotificationToID = function (notificationText, id) {

    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const notificationObject = createDeviceMessage(notificationText, [id]);

    return createNotificationPromise(notificationObject);   
}

/**
 *  Send a notification to a multiple One Signal devices.
 * @param {string} notificationText - Displayed text in the notification
 * @param {string[]} ids - Player IDs of the targeted devices
 * @example
 * //Will display a stringified object containing the id of the notification and the number of recipients.
 * sendNotificationToMultId("Hello World", ["userOneDeviceId","userTwoDeviceId"]).then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response.
 */
exports.sendNotificationToMultID = function (notificationText, ids) {

    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const notificationObject = createDeviceMessage(notificationText, ids);

    return createNotificationPromise(notificationObject);   
}

/**
 *  Send a notification to a multiple One Signal devices.
 * @param {string} notificationText - Displayed text in the notification
 * @param {string[]} usernames - Array of assigned usernames to the targeted devices
 * @example
 * //Will display a stringified object containing the id of the notification and the number of recipients.
 * sendNotificationToMultUsername("Hello World", ["username1","username2"]).then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response.
 */
exports.sendNotificationToMultUsername = function (notificationText, usernames)
{
    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const notificationObject = createUsernameMessage(notificationText,usernames);

    return createNotificationPromise(notificationObject);
}

/**
 *  Send a notification to a multiple One Signal devices.
 * @param {string} notificationText - Displayed text in the notification
 * @param {string} username - Username assigned to the targeted device
 * @example
 * //Will display a stringified object containing the id of the notification and the number of recipients.
 * sendNotificationToUsername("Hello World", "solouser").then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response.
 */
exports.sendNotificationToUsername = function (notificationText, username)
{
    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const notificationObject = createUsernameMessage(notificationText,[username]);

    return createNotificationPromise(notificationObject);
}

/**
 *  Send a notification to a multiple One Signal devices.
 * @param {string} username - Username to assign to the device
 * @param {string} id - Id of the targeted device
 * @example
 * //Will display a stringified object containing the success state of the request.
 * assignUsernameToID("UsernameOrEmail", "deviceID").then( function (data) {
 *      console.log("One Signal response " + data);
 * });
 * @returns {Promise} A promise that returns a parsed JSON response containing One Signal response.
 */
exports.assignUsernameToID = function (username, id) {

    if (!isConfigured()) {
        throw new Error(configurationError);
    }

    const updateObject = createUpdateUsernameMessage(username);

    return createUpdateUsernamePromise(id,updateObject);
}

/**********************************/
/**** Module private functions ****/
/**********************************/

/**
 *  Verify if One Signal application ID and authorization headers are set.
 * @private
 * @returns {boolean} True if correctly configured, else false.
 */
function isConfigured() {
    return appId !== null && authorizationHeader !== null;
}

/**
 *  Create message object to be sent as a notification targeting segments.
 * @private
 * @param {string} content  Text content of the notification
 * @param {string[]} segments Array of targeted segments
 * @returns {string} Notification stringified object.
 */
function createSegmentMessage(content, segments) {

    const message = {
        app_id: appId,
        contents: { "en": content },
        included_segments: segments
    };

    return JSON.stringify(message);
}

/**
 * Create message object to be sent as a notification targeting devices.
 * @private
 * @param {string} content  Text content of the notification
 * @param {string[]} ids Array of targeted devices
 * @returns {string} Notification stringified object.
 */
function createDeviceMessage(content, ids)
{

    const message = {
        app_id : appId,
        contents : { "en" : content},
        include_player_ids : ids
    };

    return JSON.stringify(message);
}

/**
 * Create message object to be sent as a notification targeting devices with specific usernames.
 * @private
 * @param {string} content  Text content of the notification
 * @param {string[]} usernames Array of targeted username tags
 * @returns {string} Notification stringified object.
 */
function createUsernameMessage(content, usernames)
{
    let tags = []

    usernames.forEach(function(x) {

        const tag = {
            field : "tag",
            key : "username",
            value : x
        };

        const operator = {
            operator : "OR"
        };


        tags.push(tag);
        tags.push(operator);
    });

    tags.pop();

    const message = {
        app_id : appId,
        contents : { "en" : content},
        filters : tags
    }

    return JSON.stringify(message);
}

/**
 * Create message object to be sent as a notification targeting devices with specific usernames.
 * @private
 * @param {string} playerId Player ID of the device to update
 * @param {string} username Username to assign
 * @returns {string} Update tag stringified object.
 */
function createUpdateUsernameMessage(username) {

    const message = {
        app_id : appId,
        tags : {"username" : username}
    }

    return JSON.stringify(message);
}

/**
 *  Create option object to be sent with the notification request.
 * @private
 * @param {Object} content Notification object
 * @returns {Object} Option object with headers, uri and body set.
 */
function createNotificationOptions(content) {

    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": authorizationHeader
    };

    const options = {
        uri : notificationEndpoint,
        body : content,
        headers : headers,
        method : "POST"
    };

    return options;
}

/**
 *  Create option object to be sent with the notification request.
 * @private
 * @param {string} playerId PlayerId of the targeted device
 * @param {Object} content Update object    
 * @returns {Object} Option object with headers, uri and body set.
 */
function createUpdateOptions(playerId, content) {

    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": authorizationHeader
    };

    const options = {
        uri : playerEndpoint+playerId,
        body : content,
        headers : headers,
        method : "PUT"
    };

    return options;   
}

/**
 *  Create request promise with options set.
 * @private
 * @param {Object} Options of the request
 * @returns {Promise} Request promise returning response on .then.
 */
function createPromiseRequest(options) {

    const promise = reqPromise(options)
        .then(  function(data) {

            const parsedData = JSON.parse(data);
            
            if (parsedData.errors) {
                throw new Error(parsedData.errors);
            }

            return data;
        })
        .catch( function(err) {
            throw err;
        });

    return promise;
}

/**
 *  Create request promise with notification object set.
 * @private
 * @param {Object} notificationObject Object to be sent
 * @returns {Promise} Request promise returning response on .then.
 */
function createNotificationPromise(notificationObject) {

    const requestOptions = createNotificationOptions(notificationObject);

    return createPromiseRequest(requestOptions);
}

/**
 *  Create request promise with notification object set.
 * @private
 * @param {string} playerId PlayerId of the targeted device
 * @param {Object} updateObject Object to be sent
 * @returns {Promise} Request promise returning response on .then.
 */
function createUpdateUsernamePromise(playerId,updateObject) {

    const requestOptions = createUpdateOptions(playerId,updateObject);

    return createPromiseRequest(requestOptions);
}