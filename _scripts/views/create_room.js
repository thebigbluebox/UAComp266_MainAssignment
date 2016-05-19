/**
 * create_room.js will be the function to communicate the creation of a room
 * it will also include the ability to save the location of where the room will be organized
 */

"use strict";

// Using the fireBaseRef from the firebase.js we create our room under the child rooms
var roomRef = fireBaseRef.child("rooms");

function createRoom() {
    // Empty room object
    var room = {};
    var roomId = "";
    room.roomName = $("#new_room_form_name_input").val();
    // The room geolocation provided by places autocomplete
    room.roomLocation = $("#pac-input").val();
    // coord is a global variable within gmaps_autocomplete
    room.lnglat = coord;
    
    if (room.roomName !== "" && room.roomLocation !== "") {
        roomId = roomRef.push(room);
    }
    // Navigate to the created room right after submitting
    window.location.href = "./room.html?room=" + roomId.key();
}