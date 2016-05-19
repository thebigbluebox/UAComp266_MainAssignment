/**
 * list_room.js is the FireBase component that lists out all rooms on to the page list_room.html
 * it shows all rooms that are active and allows users to see and join the room
 * 
 * This file implement's FireBase's callback and snapshot pattern
 * 
 * This file is very similar to cuisines_options, please refer to that for firebase pattern's documentation
 */

"use strict";
// The base room reference
var roomListRef = fireBaseRef.child("rooms");

// HTML view for the table of rooms
var roomHtmlForPath = {};
// View for the table of rooms
var roomListView = roomListRef  ;

function handleRoomAdded(roomSnapshot, prevRoomName) {
    if (typeof (roomSnapshot) === "Undefined" || typeof (prevRoomName) === "Undefined") {
        return;
    }
    var newroomRow = $("<tr class=\"restaurantRow\" id=\"" + roomSnapshot.key() + "\"/>");
    newroomRow.append($("<th/>"));
    newroomRow.append($("<td/>").append($("<em/>").text(roomSnapshot.val().roomName)));
    newroomRow.append($("<td/>").append($("<a href=\"" + "./room.html?room=" + roomSnapshot.key() + " \" />").text("Link")));
    newroomRow.append($("<td/>").text(roomSnapshot.val().roomLocation));

    roomHtmlForPath[roomSnapshot.key()] = newroomRow;

    if (prevRoomName === null) {
        $("#room_list").append(newroomRow);
    }
    else {
        var lowerScoreRow = roomHtmlForPath[prevRoomName];
        lowerScoreRow.before(newroomRow);
    }
}

function handleRoomRemoved(roomSnapshot) {
    if (typeof (roomSnapshot) === "Undefined") {
        return;
    }
    var removedRoomRow = roomHtmlForPath[roomSnapshot.key()];
    removedRoomRow.remove();
    delete roomHtmlForPath[roomSnapshot.key()];
}

roomListView.on('child_added', function (newroomSnapshot, prevRoomName) {
    handleRoomAdded(newroomSnapshot, prevRoomName);
});

roomListView.on('child_removed', function (oldroomSnapshot) {
    handleRoomRemoved(oldroomSnapshot);
});

var changedCallback = function (roomSnapshot, prevRoomName) {

    if (typeof (roomSnapshot) === "Undefined" || typeof (prevRoomName) === "Undefined") {
        return;
    }
    handleRoomRemoved(roomSnapshot);
    handleRoomAdded(roomSnapshot, prevRoomName);
};
roomListView.on('child_moved', changedCallback);
roomListView.on('child_changed', changedCallback);
