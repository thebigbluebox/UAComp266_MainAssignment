"use strict";
//The following keys would be dynamic
var roomKey = "-KEydI09pWju-abiTzpG";
$(document).ready(function() {
    var LEADERBOARD_SIZE = 5;

    // Create our Firebase reference
    var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');
    var roomRef = fireBaseRef.child("rooms").child(roomKey);
    var participantsRef = fireBaseRef.child("rooms").child(roomKey).child("participants");
    var restaurantListRef = fireBaseRef.child("rooms").child(roomKey).child("restaurantList");

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
        $("#"+restaurantSnapshot.key()).on('click', function(e) {
            var selectionId = $(this).attr("id");
            var upvotesRef = fireBaseRef.child("rooms").child(roomKey).child("restaurantList").child(selectionId).child("vote"); 
            upvotesRef.transaction(function(current_value) {
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
    restaurantListView.on('child_added', function(newrestaurantSnapshot, prevRestaurantName) {
        handleRestaurantAdded(newrestaurantSnapshot, prevRestaurantName);
    });

    // Add a callback to handle when a score is removed
    restaurantListView.on('child_removed', function(oldrestaurantSnapshot) {
        handleRestaurantRemoved(oldrestaurantSnapshot);
    });

    // Add a callback to handle when a score changes or moves positions.
    var changedCallback = function(restaurantSnapshot, prevRestaurantName) {

        if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevRestaurantName) === "Undefined") {
            return;
        }
        handleRestaurantRemoved(restaurantSnapshot);
        handleRestaurantAdded(restaurantSnapshot, prevRestaurantName);
    };
    restaurantListView.on('child_moved', changedCallback);
    restaurantListView.on('child_changed', changedCallback);


    // When the user presses enter on scoreInput, add the score, and update the highest score.
    $("#restaurant_foodCriteria_input").keypress(function(e) {
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

});
