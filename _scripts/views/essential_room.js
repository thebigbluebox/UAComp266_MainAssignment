/**
 * essential_room.js covers the grounds for some of the more important areas of 
 * the room.html page, it covers the sharing link, and also the presentation logic
 * for the page
 */
"use strict";

// Function below from  stackoverflow http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
// This function extracts URL parameter values to be used
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// roomkey will be the given roomkey from firebase at the creation of this room
var roomKey;
// roomRef will be a global variable for the rooom reference to be read by participant_room and restaurants_room
var roomRef;
$(document).ready(function () {
    //The following keys would be dynamic
    roomKey = getUrlParameter('room');
    // Change the current Share URL into the location URL
    $("#share_link").attr('href', window.location.href);

    roomRef = fireBaseRef.child("rooms").child(roomKey);

    var roomName = '';
    var roomCode = 0;
    var roomLocation = '';
    // We will get the basic roomvalues from firebase once
    roomRef.on("value", function (snapshot) {
        roomName = snapshot.val().roomName;
        roomLocation = snapshot.val().roomLocation;

        $("#room_name").html(roomName);
        $("#room_code").html(roomKey);
        $("#room_location").html(roomLocation);
        roomMarker.lnglat = snapshot.val().lnglat;
        roomMarker.caption = roomName;
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

// This function will toggle the restaurant search panel
function toggleRestaurantSearch() {
    $("#restaurant_search_panel").toggle();
}