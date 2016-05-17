"use strict";

var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');

var restaurantsRef = fireBaseRef.child("restaurants");
var restaurantKey;
var editMode = false;
var restaurant = {};

$(document).ready(function () {
    function confirmation() {
        $("#confirm_rest_name").html(restaurant.name);
        $("#confirm_rest_location").html(restaurant.location);
        $("#confirm_rest_website").html(restaurant.website);
        $("#confirm_rest_cusine").html(restaurant.cusine);
        $("#confirm_rest_diet").html(restaurant.diets);
        $("#confirm_rest_description").html(restaurant.description);
        $("#confirmation_pane").css("display", "");
        $("[name='new_restaurant_form']").css("display", "none");
    }

    function edit() {
        $("#restaurant_name_input").val(restaurant.name);
        $("#restaurant_location_input").val(restaurant.location);
        $("#restaurant_website_input").val(restaurant.website);
        $("#restaurant_description_input").val(restaurant.description);
        restaurant.cusines.each(function (i, selected) { $("#restaurant_cusine_select option[value='" + selected + "']").attr("selected", "selected");});
        restaurant.diets.each(function (i, selected) { $("#restaurant_dietary_restriction_select option[value='" + selected + "']").attr("selected", "selected");});
        editMode = true;
        $("#restaurant_submit").val("Save Edit");
        $("#confirmation_pane").css("display", "none");
        $("[name='new_restaurant_form']").css("display", "");
    }
    
    function deleteRestaurant() {
        restaurantsRef.child(restaurantKey).remove();
    }
    
    function saveEdit() {
        restaurantsRef.child(restaurantKey.set(restaurant));
    }
    
    // Event handlers
    $("#restaurant_submit").click(function (e) {
        restaurant.name = $("#restaurant_name_input").val();
        restaurant.location = $("#restaurant_location_input").val();
        restaurant.website = $("#restaurant_website_input").val();
        restaurant.cusines = [];
        $("#restaurant_cusine_select :selected").each(function (i, selected) { restaurant.cusines[i] = $(selected).val(); });
        restaurant.diets = [];
        $("#restaurant_dietary_restriction_select :selected").each(function (i, selected) { restaurant.diets[i] = $(selected).val(); });
        restaurant.description = $("#restaurant_description_textarea").val();
        
        if (restaurant.name !== "" && restaurant.location !== "" && !editMode) {
            restaurantKey = restaurantsRef.push(restaurant);
            console.log("confirmation");
            confirmation();
        }
        if (editMode && restaurantKey !== '' | restaurantKey !== null) {
            console.log("Saving edit");
            saveEdit();
        }
    });
    
    $("edit_button").click(function(e){
        edit();
    });
    
    $("delete_button").click(function(e){
        deleteRestaurant();
    });
    
    $("confirm_button").click(function(e){
        window.location.replace("./");
    });
});