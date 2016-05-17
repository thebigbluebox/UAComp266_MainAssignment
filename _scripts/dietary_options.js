"use strict";

var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');
var dietaryRef = fireBaseRef.child("dietaryRestrictions");

// Handling the adding of new cusines
var dietHtmlForPath = {};
var dietListSelect = dietaryRef.orderByKey();

function handleDietAdded(dietSnapshot, prevDietName) {
    if (typeof (dietSnapshot) === "Undefined" || typeof (prevDietName) === "Undefined") {
        return;
    }
    var newDietaryOption = $("<option value=\"" + dietSnapshot.val() + "\" id=\"" + dietSnapshot.key() + "\"/>").append(dietSnapshot.val());

    // Store a reference to the table row so we can get it again later.
    dietHtmlForPath[dietSnapshot.key()] = newDietaryOption;

    // Insert the new score in the appropriate place in the table.
    if (prevDietName === null) {
        $("#restaurant_dietary_restriction_select").append(newDietaryOption);
    }
    else {
        var lowerScoreRow = dietHtmlForPath[prevDietName];
        lowerScoreRow.before(newDietaryOption);
    }
}

// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleCusineRemoved(dietSnapshot) {
    if (typeof (restaurantSnapshot) === "Undefined") {
        return;
    }
    var removedCusineOption = dietHtmlForPath[dietSnapshot.key()];
    removedCusineOption.remove();
    delete dietHtmlForPath[dietSnapshot.key()];
}

// Add a callback to handle when a new score is added. 
// This  function with on is used in accordance with firebase's JS
dietListSelect.on('child_added', function (dietSnapshot, prevDietName) {
    handleDietAdded(dietSnapshot, prevDietName);
});

// Add a callback to handle when a score is removed
dietListSelect.on('child_removed', function (dietSnapshot) {
    handleCusineRemoved(dietSnapshot);
});

// Add a callback to handle when a score changes or moves positions.
var changedCallback = function (dietSnapshot, prevDietName) {

    if (typeof (dietSnapshot) === "Undefined" || typeof (prevDietName) === "Undefined") {
        return;
    }
    handleCusineRemoved(dietSnapshot);
    handleDietAdded(dietSnapshot, prevDietName);
};
dietListSelect.on('child_moved', changedCallback);
dietListSelect.on('child_changed', changedCallback);

$("#other_restaurant_dietary_restriction_input").keypress(function (e) {
    if (e.keyCode == 13) {
        var newDietary = $("#other_restaurant_dietary_restriction_input").val();
        if (newDietary) {
            dietaryRef.push(newDietary);
        }
        $("#other_restaurant_dietary_restriction_input").val("");
    }
});