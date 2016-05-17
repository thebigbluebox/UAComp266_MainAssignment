"use strict";

var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');
var cusisinesRef = fireBaseRef.child("cuisines");

// Handling the adding of new cusines
var cusineHtmlForPath = {};
var cusineListSelect = cusisinesRef.orderByKey();

function handleCusineAdded(cusineSnapshot, prevCusineName) {
    if (typeof (cusineSnapshot) === "Undefined" || typeof (prevCusineName) === "Undefined") {
        return;
    }
    var newCusineOption = $("<option value=\"" + cusineSnapshot.val() + "\" id=\"" + cusineSnapshot.key() + "\"/>").append(cusineSnapshot.val());

    // Store a reference to the table row so we can get it again later.
    cusineHtmlForPath[cusineSnapshot.key()] = newCusineOption;

    // Insert the new score in the appropriate place in the table.
    if (prevCusineName === null) {
        $("#restaurant_cusine_select").append(newCusineOption);
    }
    else {
        var lowerScoreRow = cusineHtmlForPath[prevCusineName];
        lowerScoreRow.before(newCusineOption);
    }
}

// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleCusineRemoved(cusineSnapshot) {
    if (typeof (restaurantSnapshot) === "Undefined") {
        return;
    }
    var removedCusineOption = cusineHtmlForPath[cusineSnapshot.key()];
    removedCusineOption.remove();
    delete cusineHtmlForPath[cusineSnapshot.key()];
}

// Add a callback to handle when a new score is added. 
// This  function with on is used in accordance with firebase's JS
cusineListSelect.on('child_added', function (cusineSnapshot, prevCusineName) {
    handleCusineAdded(cusineSnapshot, prevCusineName);
});

// Add a callback to handle when a score is removed
cusineListSelect.on('child_removed', function (cusineSnapshot) {
    handleCusineRemoved(cusineSnapshot);
});

// Add a callback to handle when a score changes or moves positions.
var changedCallback = function (cusineSnapshot, prevCusineName) {

    if (typeof (cusineSnapshot) === "Undefined" || typeof (prevCusineName) === "Undefined") {
        return;
    }
    handleCusineRemoved(cusineSnapshot);
    handleCusineAdded(cusineSnapshot, prevCusineName);
};
cusineListSelect.on('child_moved', changedCallback);
cusineListSelect.on('child_changed', changedCallback);

$("#other_restaurant_type_input").keypress(function (e) {
    if (e.keyCode == 13) {
        var newCusine = $("#other_restaurant_type_input").val();
        if (newCusine) {
            cusisinesRef.push(newCusine);
        }
        $("#other_restaurant_type_input").val("");
    }
});