/**
 * dietary_options.js is the firebase connected component that handles the population
 * of all user defined dietary restrictions. It will automatically update all dietary restrictions and
 * give the ability to add new options as well
 * 
 * This file implement's FireBase's callback and snapshot pattern
 */

"use strict";
// The base dietary restrictions firebase reference
var dietaryRef = fireBaseRef.child("dietaryRestrictions");

// Handling the adding of new dietary restrictions
var dietHtmlForPath = {};
// This will give our view of dietary restrictions list ordered by the unique key
var dietListSelect = dietaryRef.orderByKey();

function handleDietAdded(dietSnapshot, prevDietName) {
    if (typeof (dietSnapshot) === "Undefined" || typeof (prevDietName) === "Undefined") {
        return;
    }
    var newDietaryOption = $("<option value=\"" + dietSnapshot.val() + "\" id=\"" + dietSnapshot.key() + "\"/>").append(dietSnapshot.val());

    // Store a reference to the table row so we can get it again later.
    dietHtmlForPath[dietSnapshot.key()] = newDietaryOption;

    // Insert the new dietary restriction in the appropriate place in the table.
    if (prevDietName === null) {
        $(".dietary_restriction_select").append(newDietaryOption);
    }
    else {
        var lowerScoreRow = dietHtmlForPath[prevDietName];
        lowerScoreRow.before(newDietaryOption);
    }
}

// Helper function to handle a dietary restriction being removed; just removes the corresponding table row.
function handlecuisineRemoved(dietSnapshot) {
    if (typeof (restaurantSnapshot) === "Undefined") {
        return;
    }
    var removedcuisineOption = dietHtmlForPath[dietSnapshot.key()];
    removedcuisineOption.remove();
    delete dietHtmlForPath[dietSnapshot.key()];
}

// Add a callback to handle when a new dietary restriction is added. 
// This  function with on is used in accordance with firebase's JS
dietListSelect.on('child_added', function (dietSnapshot, prevDietName) {
    handleDietAdded(dietSnapshot, prevDietName);
});

// Add a callback to handle when a dietary restriction is removed
dietListSelect.on('child_removed', function (dietSnapshot) {
    handlecuisineRemoved(dietSnapshot);
});

// Add a callback to handle when a dietary restriction changes or moves positions.
var changedCallback = function (dietSnapshot, prevDietName) {

    if (typeof (dietSnapshot) === "Undefined" || typeof (prevDietName) === "Undefined") {
        return;
    }
    handlecuisineRemoved(dietSnapshot);
    handleDietAdded(dietSnapshot, prevDietName);
};
dietListSelect.on('child_moved', changedCallback);
dietListSelect.on('child_changed', changedCallback);

// This listener below is to listen to the page of create_restaurant so that new dietary restriction options can be populated
$("#new_restaurant_form_other_dietary_restriction_input").keypress(function (e) {
    if (e.keyCode == 13) {
        var newDietary = $("#new_restaurant_form_other_dietary_restriction_input").val();
        if (newDietary) {
            dietaryRef.push(newDietary);
        }
        $("#new_restaurant_form_other_dietary_restriction_input").val("");
    }
});