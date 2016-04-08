  "use strict";
  var LEADERBOARD_SIZE = 5;

  // Create our Firebase reference
  var restaurantListRef = new Firebase('torrid-fire-6240.firebaseIO.com');

  // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
  var htmlForPath = {};

  // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
  function handleRestaurantAdded(restaurantSnapshot, prevRestaurantName) {
    if(typeof(restaurantSnapshot) === "Undefined" || typeof(prevResturantName) === "Undefined") {
        return;
    }
    var newResturantRow = $("<tr/>");
    newResturantRow.append($("<th/>"));
    newResturantRow.append($("<td/>").append($("<em/>").text(restaurantSnapshot.val().name)));
    newResturantRow.append($("<td/>").text(restaurantSnapshot.val().location));
    newResturantRow.append($("<td/>").text(restaurantSnapshot.val().foodCriteria));
    newResturantRow.append($("<td/>").text(restaurantSnapshot.val().vote));

    // Store a reference to the table row so we can get it again later.
    htmlForPath[restaurantSnapshot.key()] = newResturantRow;

    // Insert the new score in the appropriate place in the table.
    if (prevRestaurantName === null) {
      $("#resturantTable").append(newResturantRow);
    }
    else {
      var lowerScoreRow = htmlForPath[prevRestaurantName];
      lowerScoreRow.before(newResturantRow);
    }
  }
  
  function handleVoting(voteStatus) {
      if(typeof(voteStatus) === "Undefined") {
          return;
      }
      var voteStatus;
  }

  // Helper function to handle a score object being removed; just removes the corresponding table row.
  function handleRestaurantRemoved(restaurantSnapshot) {
      if (typeof(resturantSnapshot) === "Undefined") {
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
    if(typeof(restaurantSnapshot) === "Undefined" || typeof(prevRestaurantName) === "Undefined") {
        return;
    }
    handleRestaurantRemoved(restaurantSnapshot);
    handleRestaurantAdded(restaurantSnapshot, prevRestaurantName);
  };
  restaurantListView.on('child_moved', changedCallback);
  restaurantListView.on('child_changed', changedCallback);

  // When the user presses enter on scoreInput, add the score, and update the highest score.
  $("#resturant_name_input").keypress(function (e) {
    if (e.keyCode == 13) {
      var newVote = 1;
      var name = $("#resturant_name_input").val();
      $("#scoreInput").val("");
      
      var location = $("#resturant_location_input").val();
      $("#resturant_location_input").val("");
      
      var foodCriterias = $("#resturant_foodCriteria_input").val();
      $("#resturant_foodCriteria_input").val("");

      if (name.length === 0)
        return;

      var userScoreRef = restaurantListRef.child(name);

      // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
      userScoreRef.setWithPriority({ name:name, vote:newVote }, newVote);
    }
  });
