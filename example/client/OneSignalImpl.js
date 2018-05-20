const socket = io.connect();

const OneSignal = window.OneSignal || [];

var currentUserId;

//Prompt user
OneSignal.push(function () {
    OneSignal.init({
    appId: appId
    });
});

//Send player ID after new subscription
OneSignal.push(function () {
    OneSignal.on('subscriptionChange', function (isSubscribed) {
    OneSignal.getUserId(function (userId) {

        socket.emit("newUserId", userId);
        currentUserId = userId;
        document.getElementById("advice").innerHTML = "";
        console.log("User accepted push notifications");
        });
         
    });
});

//Check for user push notif state and display informative text
OneSignal.push(function () {
    if (!OneSignal.isPushNotificationsSupported()) {
    document.getElementById("error").innerHTML = "<p color='red'>Your device does not support web push notifications</p>";
    console.log("Push notifs not supported");
    }
    else {
    OneSignal.isPushNotificationsEnabled().then(function (enabled) {
        if (!enabled) {
        document.getElementById("advice").innerHTML = "Please enable push notifications for a better user experience";
        console.log("Push notifs not enabled");
        }
        else {
        console.log("Has push notifs enabled");
        OneSignal.push(function () {
            OneSignal.getUserId(function (userId) {
            socket.emit("userId", userId);
            currentUserId = userId;
            });
        });

        }
    });
    }
});

//Send a notifications to all users
function sendNotifAll() {
    socket.emit("sendNotifAll", document.getElementsByName("notifTextAll")[0].value);
}

function sendNotifId() {
    socket.emit("sendNotifId", document.getElementsByName("notifTextId")[0].value);
}

function sendNotifSegment() {
    socket.emit("sendNotifSegment", document.getElementsByName("notifTextSegment")[0].value);
}

function sendNotifSaved() {
    socket.emit("sendNotifSaved");
}

function sendAssignUsername() {
    if(currentUserId)
    socket.emit("sendAssignUsername", document.getElementsByName("notifAssignUsername")[0].value, currentUserId);
    else
    console.log("No current user id set")
}

function sendNotifUsername() {
    socket.emit("sendNotifUsername", document.getElementsByName("notifTextUsername")[0].value);
}
