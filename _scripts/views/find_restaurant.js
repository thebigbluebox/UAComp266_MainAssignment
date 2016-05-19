/**
 * Find_restaurant.js is a firebase component that lists out all restaurants dynamically
 * and removes and show them get updated in realtime. It also gives the ability to filter
 * from search terms and categories
 * 
 * This file implement's FireBase's callback and snapshot pattern
 */
"use strict";

// Base firebase reference for restaurants
var restaurantListRef = fireBaseRef.child("restaurants");
// Used for storing all elements that satisfy the search criteria
var searchSelectorElements;

var RESTAURANTLIST_SIZE = 100;
// Storage path for the dynamically generated table
var restaurantHtmlForPath = {};
// Firebase restaurant view
var restaurantListView = restaurantListRef.limitToLast(RESTAURANTLIST_SIZE);

function handleRestaurantAdded(restaurantSnapshot, prevRestaurantName) {
    if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevrestaurantName) === "Undefined") {
        return;
    }
    // Building the HTML table dom
    var newrestaurantRow = $("<tr class=\"restaurantRow\" id=\"" + restaurantSnapshot.key() + "\"/>");
    newrestaurantRow.append($("<th/>").append($("<button onclick=\"addRestaurant(\'" + restaurantSnapshot.key() + "\')\" class='room_only' />").text("Add")));
    newrestaurantRow.append($("<td/>").append($("<em/>").text(restaurantSnapshot.val().name)));
    newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().location));
    newrestaurantRow.append($("<td/>").append($("<a href='" + restaurantSnapshot.val().website + "' />").text(restaurantSnapshot.val().website)));
    newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().cuisine));
    newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().dietary_restriction));

    // Store a reference to the table row so we can get it again later.
    restaurantHtmlForPath[restaurantSnapshot.key()] = newrestaurantRow;

    // Insert the new restaurant in the appropriate place in the table.
    if (prevRestaurantName === null) {
        $("#restaurants_list").append(newrestaurantRow);
    }
    else {
        var lowerScoreRow = restaurantHtmlForPath[prevRestaurantName];
        lowerScoreRow.before(newrestaurantRow);
    }
}

// Helper function to handle a restaurant object being removed; just removes the corresponding table row.
function handleRestaurantRemoved(restaurantSnapshot) {
    if (typeof (restaurantSnapshot) === "Undefined") {
        return;
    }
    var removedRestaurantRow = restaurantHtmlForPath[restaurantSnapshot.key()];
    removedRestaurantRow.remove();
    delete restaurantHtmlForPath[restaurantSnapshot.key()];
}

// Add a callback to handle when a new restaurant is added. 
// This  function with on is used in accordance with firebase's JS
restaurantListView.on("child_added", function (newrestaurantSnapshot, prevRestaurantName) {
    handleRestaurantAdded(newrestaurantSnapshot, prevRestaurantName);
});

// Add a callback to handle when a restaurant is removed
restaurantListView.on("child_removed", function (oldrestaurantSnapshot) {
    handleRestaurantRemoved(oldrestaurantSnapshot);
});

// Add a callback to handle when a restaurant changes or moves positions.
var changedCallback = function (restaurantSnapshot, prevRestaurantName) {

    if (typeof (restaurantSnapshot) === "Undefined" || typeof (prevRestaurantName) === "Undefined") {
        return;
    }
    handleRestaurantRemoved(restaurantSnapshot);
    handleRestaurantAdded(restaurantSnapshot, prevRestaurantName);
};
restaurantListView.on('child_moved', changedCallback);
restaurantListView.on('child_changed', changedCallback);

// buildQueryList will generate an array of keywords to look for when users want to search the table
function buildQueryList() {
    var searchString = $("#restaurant_search_form_searchtext_input").val();
    if (typeof(searchstring) !== "Undefined" || searchString.trim.length !== 0) {
        searchString = searchString.split(" ");
    }
    // We retrieve the list of selected select options, and then place them all in an array
    var cuisines = [];
    $(".cuisine_select :selected").each(function (i, selected) { cuisines[i] = $(selected).val(); });
    var diets = [];
    $(".dietary_restriction_select :selected").each(function (i, selected) { diets[i] = $(selected).val(); });
    // Concatenate the arrays together to get one list of keywords to search for
    searchString = searchString.concat(cuisines, diets);
    return searchString;
}

// Function for the finding of restaurant and filtering of the view
function find() {
    // Build search keyword array
    var searchArray = buildQueryList();
    // The search selector row
    var searchSelector = "#restaurants_list tr > ";
    for (var item in searchArray) {
        // remenber to trim the last two characters of + and space
        searchSelector += "td:contains(" + searchArray[item] + ") + ";
    }
    // Selector credited to http://stackoverflow.com/questions/3657885/jquery-check-to-see-if-table-row-containing-certain-values-exists-already
    searchSelector = searchSelector.substring(0, searchSelector.length - 2);
    // Once we find the list of elements that match, we place a class in the row's parent to show
    searchSelectorElements = $(searchSelector).parent().attr("class", "selected");;

    // Help from http://stackoverflow.com/questions/11410415/hide-table-rows-that-dont-have-a-certain-class
    // Selector will find all rows that are not selected and hide them
    $("#restaurants_list").find("tr").not(".selected").hide();
}

