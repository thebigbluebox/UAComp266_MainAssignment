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

//The following keys would be dynamic
var roomKey = getUrlParameter('room');
// Change the current Share URL into the location URL
$("#share_link").attr('href', window.location.href);

$(document).ready(function () {
    var LEADERBOARD_SIZE = 5;

    // Create our Firebase reference
    var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');
    var roomRef = fireBaseRef.child("rooms").child(roomKey);


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

    var participantsRef = fireBaseRef.child("rooms").child(roomKey).child("participants");
    var restaurantListRef = fireBaseRef.child("rooms").child(roomKey).child("restaurantList");
    var participantsListView = participantsRef.limitToLast(LEADERBOARD_SIZE);
    // Participants JS
    var htmlForPath2 = {};

    participantsListView.on('child_removed', function (oldparticipantSnapshot) {
        handleParticipantRemoved(oldparticipantSnapshot);
    });

    function handleParticipantRemoved(participantSnapshot) {
        if (typeof (participantSnapshot) === "Undefined") {
            return;
        }
        var removedParticipantRow = htmlForPath[participantSnapshot.key()];
        removedParticipantRow.remove();
        delete htmlForPath[participantSnapshot.key()];
    }

    participantsListView.on("child_added", function (newParticipantSnapshot, prevParticipantName) {
        handleParticipantAdded(newParticipantSnapshot, prevParticipantName);
    });

    function handleParticipantAdded(newParticipantSnapshot, prevParticipantName) {
        if (typeof (newParticipantSnapshot) === "Undefined" || typeof (newParticipantSnapshot) === "Undefined") {
            return;
        }
        var newParticipantRow = $("<tr class=\"restaurantRow\" id=\"" + newParticipantSnapshot.key() + "\"/>");
        newParticipantRow.append($("<th/>"));
        newParticipantRow.append($("<td/>").append($("<em/>").text(newParticipantSnapshot.val().name)));
        newParticipantRow.append($("<td/>").text(newParticipantSnapshot.val().email));
        newParticipantRow.append($("<td/>").text(newParticipantSnapshot.val().restrictions));

        // Store a reference to the table row so we can get it again later.
        htmlForPath2[newParticipantSnapshot.key()] = newParticipantRow;

        // Insert the new score in the appropriate place in the table.
        if (prevParticipantName === null) {
            $("#participantTable").append(newParticipantRow);
        }
    }
    var changedCallbackParticipants = function (restaurantSnapshot, prevRestaurantName) {

        if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevRestaurantName) === "Undefined") {
            return;
        }
        handleParticipantRemoved(restaurantSnapshot);
        handleParticipantAdded(restaurantSnapshot, prevRestaurantName);
    };
    participantsListView.on('child_moved', changedCallback);
    participantsListView.on('child_changed', changedCallback);


    // END OF HANDLING PARTICIPANTS


    // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
    var htmlForPath = {};

    // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
    function handleRestaurantAdded(restaurantSnapshot, prevRestaurantName) {
        if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevrestaurantName) === "Undefined") {
            return;
        }
        var newrestaurantRow = $("<tr class=\"restaurantRow\" id=\"" + restaurantSnapshot.key() + "\"/>");
        newrestaurantRow.append($("<th/>"));
        newrestaurantRow.append($("<td/>").append($("<em/>").text(restaurantSnapshot.val().name)));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().location));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().criteria));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().vote));

        // Store a reference to the table row so we can get it again later.
        htmlForPath[restaurantSnapshot.key()] = newrestaurantRow;

        // Insert the new score in the appropriate place in the table.
        if (prevRestaurantName === null) {
            $("#restaurantTable").append(newrestaurantRow);
        }
        else {
            var lowerScoreRow = htmlForPath[prevRestaurantName];
            lowerScoreRow.before(newrestaurantRow);
        }
        $("#" + restaurantSnapshot.key()).on('click', function (e) {
            var selectionId = $(this).attr("id");
            var upvotesRef = fireBaseRef.child("rooms").child(roomKey).child("restaurantList").child(selectionId).child("vote");
            upvotesRef.transaction(function (current_value) {
                return (current_value || 0) + 1;
            });
        });
    }


    function handleVoting(voteStatus) {
        if (typeof (voteStatus) === "Undefined") {
            return;
        }
        var voteStatus;
    }

    // Helper function to handle a score object being removed; just removes the corresponding table row.
    function handleRestaurantRemoved(restaurantSnapshot) {
        if (typeof (restaurantSnapshot) === "Undefined") {
            return;
        }
        var removedRestaurantRow = htmlForPath[restaurantSnapshot.key()];
        removedRestaurantRow.remove();
        delete htmlForPath[restaurantSnapshot.key()];
    }

    // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
    var restaurantListView = restaurantListRef.limitToLast(LEADERBOARD_SIZE);

    // Add a callback to handle when a new score is added. 
    // This  function with on is used in accordance with firebase's JS
    restaurantListView.on('child_added', function (newrestaurantSnapshot, prevRestaurantName) {
        handleRestaurantAdded(newrestaurantSnapshot, prevRestaurantName);
    });

    // Add a callback to handle when a score is removed
    restaurantListView.on('child_removed', function (oldrestaurantSnapshot) {
        handleRestaurantRemoved(oldrestaurantSnapshot);
    });

    // Add a callback to handle when a score changes or moves positions.
    var changedCallback = function (restaurantSnapshot, prevRestaurantName) {

        if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevRestaurantName) === "Undefined") {
            return;
        }
        handleRestaurantRemoved(restaurantSnapshot);
        handleRestaurantAdded(restaurantSnapshot, prevRestaurantName);
    };
    restaurantListView.on('child_moved', changedCallback);
    restaurantListView.on('child_changed', changedCallback);


    // When the user presses enter on scoreInput, add the score, and update the highest score.
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

            restaurantListRef.push({ name: name, vote: newVote, location: location, criteria: foodCriterias });
        }
    });

    $("#join_room_button").click(function (e) {
        var name = $("#join_name_input").val();
        // $("#join_name_input").val("");
        var email = $("#join_email_input").val();
        // $("#join_email_input").val("");
        var restrictions_array = [];
        // technique found on http://marcgrabanski.com/jquery-select-list-values/
        $("#join_restaurant_dietary_restriction_select :selected").each(function (i, selected) { restrictions_array[i] = $(selected).val() });

        participantsRef.push({ name: name, email: email, restrictions: restrictions_array });
    });
});
