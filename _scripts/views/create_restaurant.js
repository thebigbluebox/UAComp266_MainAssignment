/**
 * create_restaurant.js will be used in the creation and the presentation logic of the
 * create_restaurant.html page. It will create a global restaurantsRef to be accessible 
 * to any library below.
 */

// The restaurantsRef created as a child of the fireBaseRef
var restaurantsRef = fireBaseRef.child("restaurants");
// Restaurant key will be the generated id for the created restaurant
var restaurantKey = "";
// The editMode boolean will define if the current user has entered the edit mode screen
var editMode = false;
// The restaurant object
var restaurantObj = {};


// Confirmation will fill out the tags on the confirmation screen once the user clicked submit
function confirmation() {
    $("#confirm_rest_name").html(restaurantObj.name);
    $("#confirm_rest_location").html(restaurantObj.location);
    $("#confirm_rest_website").html(restaurantObj.website);
    $("#confirm_rest_cuisine").html(restaurantObj.cuisine);
    $("#confirm_rest_dietary_restriction").html(restaurantObj.dietary_restriction);
    $("#confirm_rest_description").html(restaurantObj.description);
    // We change the current panel view to show while hiding the form
    $("#confirmation_pane").css("display", "");
    $("[name='new_restaurant_form']").css("display", "none");
}
// Edit will close the confirmation view, and set the editflag so the changes can be saved
function edit() {
    // Setting the editMode flag
    editMode = true;
    $("#restaurant_submit").val("Save Edit");
    // We change the currently displayed panel 
    $("#confirmation_pane").css("display", "none");
    $("[name='new_restaurant_form']").css("display", "");
}
// Deletes the restaurant from FireBase
function deleteRestaurant() {
    restaurantsRef.child(restaurantKey).remove();
}
// Saves the edit by setting the created restaurant's key
function saveEdit() {
    restaurantsRef.child(restaurantKey).set(restaurantObj);
}

function editRestaurant() {
    edit();
}

function deleteRestaurant() {
    deleteRestaurant();
}

function confirmRestaurant() {
    window.location.replace("./");
}

function createRestaurant() {
    // Retrieve all form fields
    restaurantObj.name = $("#new_restaurant_form_name_input").val();
    restaurantObj.location = $("#pac-input").val();
    restaurantObj.lnglat = coord;
    restaurantObj.website = $("#new_restaurant_form_website_input").val();
    // To retrieve all the criterias we will do a search on all selected
    // Solution taken from Stackoverflow 
    restaurantObj.cuisine = [];
    $("#new_restaurant_form_cuisine_select :selected").each(function (i, selected) { restaurantObj.cuisine[i] = $(selected).val(); });
    restaurantObj.dietary_restriction = [];
    $("#new_restaurant_form_dietary_restriction_select :selected").each(function (i, selected) { restaurantObj.dietary_restriction[i] = $(selected).val(); });
    restaurantObj.description = $("#new_restaurant_form_description_textarea").val();

    if (restaurantObj.name !== "" && restaurantObj.location !== "" && !editMode) {
        restaurantKey = restaurantsRef.push(restaurantObj);
        console.log("confirmation");
        confirmation();
    }
    if (editMode && restaurantKey !== "" | restaurantKey !== null) {
        console.log("Saving edit");
        saveEdit();
    }
}