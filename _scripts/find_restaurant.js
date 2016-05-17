"use strict";

var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');
var restaurantsRef = fireBaseRef.child("restaurants");
var elements;
$(document).ready(function () {
    var RESTAURANTLIST_SIZE = 100;
    var restaurantListRef = restaurantsRef;
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
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().website));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().cusines));
        newrestaurantRow.append($("<td/>").text(restaurantSnapshot.val().diets));

        // Store a reference to the table row so we can get it again later.
        restaurantHtmlForPath[restaurantSnapshot.key()] = newrestaurantRow;

        // Insert the new score in the appropriate place in the table.
        if (prevRestaurantName === null) {
            $("#resturants_list").append(newrestaurantRow);
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
    
    function buildQueryList() {
        var searchString = $("#search_text_input").val().split(" ");
        var cusines = [];
        $("#restaurant_cusine_select :selected").each(function (i, selected) { cusines[i] = $(selected).val(); });
        var diets = [];
        $("#restaurant_dietary_restriction_select :selected").each(function (i, selected) { diets[i] = $(selected).val(); });
        
        searchString = searchString.concat(cusines,diets);
        console.log(searchString);
        return searchString;
    }
    
    function find() {
        var searchArray = buildQueryList();
        var searchSelector = "#resturants_list tr > ";
        for(var item in searchArray) {
            // remenber to trim the last two characters of + and space
            searchSelector += "td:contains(" + searchArray[item] + ") + ";
        }
        searchSelector = searchSelector.substring(0,searchSelector.length-2);
        elements = $(searchSelector).parent().attr("class","selected");;
        
        
        $('#resturants_list').find('tr').not('.selected').hide();
    }
    
    $("#search_submit").click(function(e){
       find(); 
    });
    
});