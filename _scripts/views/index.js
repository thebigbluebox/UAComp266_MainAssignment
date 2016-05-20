// Allows the navigation to the correct room immediently 
'use strict'

$(document).ready(function () {
    $("#room_code").keypress(function (e) {
        if (e.keyCode == 13) {
            var roomcode = $("#room_code").val();
            var currentUrl = window.location.href;
            if (roomcode.trim().length > 0) {
                window.location.href= 'room.html?room=' + roomcode;
            }
        }
    });
});