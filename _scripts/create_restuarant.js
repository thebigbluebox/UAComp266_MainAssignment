"use strict";

var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');

var restaurantsRef = fireBaseRef.child("restaurants");
var dietaryRef = fireBaseRef.child("dietaryRestrictions");
var cusisinesRef = fireBaseRef.child("cuisines");

$("#room_submit").click(function(e) {
    var restaurant = {};
    restaurant.roomName = $("#room_name_input").val();
    restaurant.roomLocation = $("#room_location_input").val();
    restaurant.publicRoomBoolean = $("#room_open_checkbox").prop("checked");
    restaurant.roomPin = $("#room_pin_input").val();
    var roomId = {};
    
    if(room.roomName !== "" && room.roomLocation !== "") {
        if(room.publicRoomBoolean == true && room.roomPin !== 0) {
            console.log("pushing non regular");
            roomId = roomRef.push(room)
        } else {
            console.log("pushing regular");
            roomId = roomRef.push(room);
        }
    }
    window.location.href = "./room.html?room=" + roomId.key();
});

