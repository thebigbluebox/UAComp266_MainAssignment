var restaurantListRef;
$(document).ready(function () {
    var RESTAURANTLIST_SIZE = 5;
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
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().cusines));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().criteria));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().vote));

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
        $("#" + restaurantSnapshot.key()).on('click', function (e) {
            var selectionId = $(this).attr("id");
            var upvotesRef = restaurantListRef.child(selectionId).child("vote");
            upvotesRef.transaction(function (current_value) {
                return (current_value || 0) + 1;
            });
        });
    }

    // Helper function to handle a score object being removed; just removes the corresponding table row.
    function handleRestaurantRemoved(restaurantSnapshot) {
        if (typeof (restaurantSnapshot) === "Undefined") {
            return;
        }
        var removedRestaurantRow = restaurantHtmlForPath[restaurantSnapshot.key()];
        removedRestaurantRow.remove();
        delete restaurantHtmlForPath[restaurantSnapshot.key()];
    }

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
            pushRestaurant(name, newVote, location, foodCriterias, []);
        }
    });
});

function pushRestaurant(name, vote, location, criteria, cusines) {
    console.log(name, vote, location, criteria, cusines);
    var criteriaSane = criteria | [];
    var cusinesSane = cusines | [];
    restaurantListRef.push({ name: name, vote: vote, location: location, criteria: criteriaSane, cusines: cusines });
}

function addRestaurant(restaurantKey) {
    var restaurant = fireBaseRef.child("restaurants").child(restaurantKey);
    console.log("restaurant key", restaurantKey);
    restaurant.on('value', function (dataSnapshot) {
        console.log("here", dataSnapshot.val().name);
        pushRestaurant(dataSnapshot.val().name, 1, dataSnapshot.val().location, dataSnapshot.val().diet, dataSnapshot.val().cusines);
    }, function (errorObject) {
        console.log("Error with query " + errorObject.code);
    });
}
