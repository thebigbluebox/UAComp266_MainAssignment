"use strict";

var fireBaseRef = new Firebase('torrid-fire-6240.firebaseIO.com');

var roomRef = fireBaseRef.child("rooms");

$("#room_open_checkbox").change(function(e) {
   if($("#room_open_checkbox").prop("checked")){
    $("#room_pin_input_label").css("display","block");
    $("#room_pin_input").css("display","block");    
   } else {
    $("#room_pin_input_label").css("display","none");
    $("#room_pin_input").css("display","none");
    $("#room_pin_input").val() = 0;
   }
});

$("#room_submit").click(function(e) {
    var room = {};
    room.roomName = $("#room_name_input").val();
    room.roomLocation = $("#room_location_input").val();
    room.privateRoomBoolean = $("#room_open_checkbox").prop("checked") | false;
    room.roomPin = $("#room_pin_input").val() | 0;
    var roomId = {};
    
    if(room.roomName !== "" && room.roomLocation !== "") {
        if(room.privateRoomBoolean == true && room.roomPin !== 0) {
            console.log("pushing non regular");
            roomId = roomRef.push(room)
        } else {
            console.log("pushing regular");
            roomId = roomRef.push(room);
        }
    }
    window.location.href = "./room.html?room=" + roomId.key();
});