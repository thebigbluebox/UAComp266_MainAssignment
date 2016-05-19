/**
 * cuisines_option.js is the firebase connected component that handles the population of
 * all user defined cuisine options. It will automatically update all cuisine options and
 * gives the ability to add new options as well
 * 
 * This file implement's FireBase's callback and snapshot pattern
 */

"use strict";
// The base cuisine firebase reference
var cuisineRef = fireBaseRef.child("cuisines");

// Handling the adding of new cuisines
var cuisineHtmlForPath = {};
// This will give our view of cusines list ordered by the unique key
var cuisineListSelect = cuisineRef.orderByKey();

function handlecuisineAdded(cuisineSnapshot, prevcuisineName) {
    if (typeof (cuisineSnapshot) === "Undefined" || typeof (prevcuisineName) === "Undefined") {
        return;
    }
    var newcuisineOption = $("<option value=\"" + cuisineSnapshot.val() + "\" id=\"" + cuisineSnapshot.key() + "\"/>").append(cuisineSnapshot.val());

    // Store a reference to the table row so we can get it again later.
    cuisineHtmlForPath[cuisineSnapshot.key()] = newcuisineOption;

    // Insert the new score in the appropriate place in the table.
    if (prevcuisineName === null) {
        $(".cuisine_select").append(newcuisineOption);
    }
    else {
        var lowerScoreRow = cuisineHtmlForPath[prevcuisineName];
        lowerScoreRow.before(newcuisineOption);
    }
}

// Helper function to handle a cuisine object being removed; just removes the corresponding table row.
function handlecuisineRemoved(cuisineSnapshot) {
    if (typeof (restaurantSnapshot) === "Undefined") {
        return;
    }
    // Deletes the HTML reference to the cuisine
    var removedcuisineOption = cuisineHtmlForPath[cuisineSnapshot.key()];
    removedcuisineOption.remove();
    delete cuisineHtmlForPath[cuisineSnapshot.key()];
}

// Add a callback to handle when a new cusine is added. 
// This  function with on is used in accordance with firebase's JS
cuisineListSelect.on('child_added', function (cuisineSnapshot, prevcuisineName) {
    handlecuisineAdded(cuisineSnapshot, prevcuisineName);
});

// Add a callback to handle when a cuisine is removed
cuisineListSelect.on('child_removed', function (cuisineSnapshot) {
    handlecuisineRemoved(cuisineSnapshot);
});

// Add a callback to handle when a score changes or moves positions.
var changedCallback = function (cuisineSnapshot, prevcuisineName) {

    if (typeof (cuisineSnapshot) === "Undefined" || typeof (prevcuisineName) === "Undefined") {
        return;
    }
    handlecuisineRemoved(cuisineSnapshot);
    handlecuisineAdded(cuisineSnapshot, prevcuisineName);
};
cuisineListSelect.on('child_moved', changedCallback);
cuisineListSelect.on('child_changed', changedCallback);

// This listener is to listen directly on to new restaurant's form input for other cuisines
$("#new_restaurant_form_other_cuisine_input").keypress(function (e) {
    if (e.keyCode == 13) {
        var newcuisine = $("#new_restaurant_form_other_cuisine_input").val();
        if (newcuisine) {
            cuisineRef.push(newcuisine);
        }
        $("#new_restaurant_form_other_cuisine_input").val("");
    }
});