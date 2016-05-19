/**
 * restaurants_room.js displays a list of all restaurants that are added to the room, and handles
 * the addition of new restaurants to the list. This class also will tally votes set by the user
 * This file implement's FireBase's callback and snapshot pattern
 * 
 * This file is very similar to cuisines_options, please refer to that for firebase pattern's documentation
 */
var restaurantListRef = {};
// This will be used for markers on the map
var restaurantMapList = [];

$(document).ready(function () {
    var RESTAURANTLIST_SIZE = 20;
    restaurantListRef = roomRef.child("restaurantList");
    var restaurantHtmlForPath = {};

    var restaurantListView = restaurantListRef.limitToLast(RESTAURANTLIST_SIZE);

    function handleRestaurantAdded(restaurantSnapshot, prevRestaurantName) {
        if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevrestaurantName) === "Undefined") {
            return;
        }
        var newrestaurantRow = $("<tr class=\"restaurantRow\" id=\"" + restaurantSnapshot.key() + "\"/>");
        newrestaurantRow.append($("<th/>"));
        newrestaurantRow.append($("<td/>").append($("<em/>").text(restaurantSnapshot.val().name)));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().location));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().cuisine));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().dietary_restriction));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().vote));
        
        restaurantMapList.push(restaurantSnapshot.val());
        // Store a reference to the table row so we can get it again later.
        restaurantHtmlForPath[restaurantSnapshot.key()] = newrestaurantRow;
        
        // Insert the new score in the appropriate place in the table.
        if (prevRestaurantName === null) {
            $("#restaurantTable").append(newrestaurantRow);
        }
        else {
            var lowerScoreRow = restaurantHtmlForPath[prevRestaurantName];
            lowerScoreRow.before(newrestaurantRow);
        }
        // This will handle the tally of scores for restaurants
        $("#" + restaurantSnapshot.key()).on('click', function (e) {
            var selectionId = $(this).attr("id");
            var upvotesRef = restaurantListRef.child(selectionId).child("vote");
            upvotesRef.transaction(function (current_value) {
                return (current_value || 0) + 1;
            });
        });
    }

    function handleRestaurantRemoved(restaurantSnapshot) {
        if (typeof (restaurantSnapshot) === "Undefined") {
            return;
        }
        var removedRestaurantRow = restaurantHtmlForPath[restaurantSnapshot.key()];
        removedRestaurantRow.remove();
        delete restaurantHtmlForPath[restaurantSnapshot.key()];
    }

    restaurantListView.on('child_added', function (newrestaurantSnapshot, prevRestaurantName) {
        handleRestaurantAdded(newrestaurantSnapshot, prevRestaurantName);
    });

    restaurantListView.on('child_removed', function (oldrestaurantSnapshot) {
        handleRestaurantRemoved(oldrestaurantSnapshot);
    });

    var changedCallback = function (restaurantSnapshot, prevRestaurantName) {

        if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevRestaurantName) === "Undefined") {
            return;
        }
        handleRestaurantRemoved(restaurantSnapshot);
        handleRestaurantAdded(restaurantSnapshot, prevRestaurantName);
    };
    restaurantListView.on('child_moved', changedCallback);
    restaurantListView.on('child_changed', changedCallback);
});
// Function that pushes restaurants into the room reference
function pushRestaurant(name, vote, location, dietary_restriction, cuisine) {
    console.log(name, vote, location, dietary_restriction, cuisine);
    var criteriaSane = dietary_restriction | [];
    var cuisinesSane = cuisine | [];
    restaurantListRef.push({ name: name, vote: vote, location: location, dietary_restriction: dietary_restriction, cuisine: cuisine });
}

// function that handles the adding of restaurants
function addRestaurant(restaurantKey) {
    var restaurant = fireBaseRef.child("restaurants").child(restaurantKey);
    console.log("restaurant key", restaurantKey);
    restaurant.on('value', function (dataSnapshot) {
        console.log("here", dataSnapshot.val().name);
        pushRestaurant(dataSnapshot.val().name, 1, dataSnapshot.val().location, dataSnapshot.val().dietary_restriction, dataSnapshot.val().cuisine);
    }, function (errorObject) {
        console.log("Error with query " + errorObject.code);
    });
}

$(".restaurantRow").click(function(e){
    var selectedRestaurantKey = $(this).parent().attr("id");
    console.log("selected",selectedRestaurantKey);
});