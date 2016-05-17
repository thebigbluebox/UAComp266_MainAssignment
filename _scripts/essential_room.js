"use strict";

// Function below from  stackoverflow http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
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

var roomKey;
var fireBaseRef;
var roomRef;
$(document).ready(function () {
    //The following keys would be dynamic
    roomKey = getUrlParameter('room');
    // Change the current Share URL into the location URL
    $("#share_link").attr('href', window.location.href);
    
    fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');
    roomRef = fireBaseRef.child("rooms").child(roomKey);
    
    var roomName = '';
    var pinNumber = 0;
    var privateRoom = false;
    var roomLocation = '';

    roomRef.on("value", function (snapshot) {
        roomName = snapshot.val().roomName;
        pinNumber = snapshot.val().roomPin;
        privateRoom = Boolean(snapshot.val().privateRoomBoolean);
        roomLocation = snapshot.val().roomLocation;

        $("#room_name").html(roomName);
        if (privateRoom) {
            $("#room_pin").html('Pin:' + pinNumber);
        } else {
            $("#room_pin").html('Public');
        }
        $("#room_location").html(roomLocation);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});