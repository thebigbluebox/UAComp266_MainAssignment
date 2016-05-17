"use strict";

var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');

$(document).ready(function () {
    var ROOMLIST_SIZE = 100;
    var roomListRef = fireBaseRef.child("rooms");
    var roomHtmlForPath = {};
    
    var roomListView = roomListRef.limitToLast(ROOMLIST_SIZE);
    
    function handleRoomAdded(roomSnapshot, prevRoomName) {
        if (typeof (roomSnapshot) === "Undefined" || typeof (prevRoomName) === "Undefined") {
            return;
        }
        var newroomRow = $("<tr class=\"restaurantRow\" id=\"" + roomSnapshot.key() + "\"/>");
        newroomRow.append($("<th/>"));
        newroomRow.append($("<td/>").append($("<em/>").text(roomSnapshot.val().roomName)));
        newroomRow.append($("<td/>").append($("<em/>").text(roomSnapshot.val().roomName)));
        newroomRow.append($("<td/>").append($("<a href=\"" + "./room.html?room=" +  roomSnapshot.key()+ " \" />").text("Link")));
        newroomRow.append($("<td/>").text(roomSnapshot.val().roomLocation));

        // Store a reference to the table row so we can get it again later.
        roomHtmlForPath[roomSnapshot.key()] = newroomRow;

        // Insert the new score in the appropriate place in the table.
        if (prevRoomName === null) {
            $("#room_list").append(newroomRow);
        }
        else {
            var lowerScoreRow = roomHtmlForPath[prevRoomName];
            lowerScoreRow.before(newroomRow);
        }
        $("#" + roomSnapshot.key()).on('click', function (e) {
            var selectionId = $(this).attr("id");
            var upvotesRef = roomListRef.child(selectionId).child("vote");
            upvotesRef.transaction(function (current_value) {
                return (current_value || 0) + 1;
            });
        });
    }

    // Helper function to handle a score object being removed; just removes the corresponding table row.
    function handleRoomRemoved(roomSnapshot) {
        if (typeof (roomSnapshot) === "Undefined") {
            return;
        }
        var removedRoomRow = roomHtmlForPath[roomSnapshot.key()];
        removedRoomRow.remove();
        delete roomHtmlForPath[roomSnapshot.key()];
    }

    // Add a callback to handle when a new score is added. 
    // This  function with on is used in accordance with firebase's JS
    roomListView.on('child_added', function (newroomSnapshot, prevRoomName) {
        handleRoomAdded(newroomSnapshot, prevRoomName);
    });

    // Add a callback to handle when a score is removed
    roomListView.on('child_removed', function (oldroomSnapshot) {
        handleRoomRemoved(oldroomSnapshot);
    });

    // Add a callback to handle when a score changes or moves positions.
    var changedCallback = function (roomSnapshot, prevRoomName) {

        if (typeof (roomSnapshot) === "Undefined" || typeof (prevRoomName) === "Undefined") {
            return;
        }
        handleRoomRemoved(roomSnapshot);
        handleRoomAdded(roomSnapshot, prevRoomName);
    };
    roomListView.on('child_moved', changedCallback);
    roomListView.on('child_changed', changedCallback);
    
    $("#restaurant_foodCriteria_input").keypress(function (e) {
        if (e.keyCode == 13) {
            var newVote = 1;
            var name = $("#restaurant_name_input").val();
            $("#scoreInput").val("");

            var location = $("#restaurant_location_input").val();
            $("#restaurant_location_input").val("");

            var foodCriterias = $("#restaurant_foodCriteria_input").val();
            $("#restaurant_foodCriteria_input").val("");

            if (name.length === 0)
                return;

            roomListRef.push({ name: name, vote: newVote, location: location, criteria: foodCriterias });
        }
    });
});