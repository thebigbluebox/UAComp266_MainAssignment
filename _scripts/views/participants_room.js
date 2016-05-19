/**
 * participants_room.js creates and maintains the table for all participants of a given room
 * It also handles the creation of new participants into the room and adds them dynamically into the room
 * 
 * This file implement's FireBase's callback and snapshot pattern
 * 
 * This file is very similar to cuisines_options, please refer to that for firebase pattern's documentation
 */
var participantsRef = {};

$(document).ready(function () {
    var PARTICIPANTLIST_SIZE = 20;
    var participantsRef = roomRef.child("participants");
    var participantHtmlForPath = {};

    var participantsListView = participantsRef.limitToLast(PARTICIPANTLIST_SIZE);

    function handleParticipantAdded(newParticipantSnapshot, prevParticipantName) {
        if (typeof (newParticipantSnapshot) === "Undefined" || typeof (prevParticipantName) === "Undefined") {
            return;
        }
        var newParticipantRow = $("<tr class=\"restaurantRow\" id=\"" + newParticipantSnapshot.key() + "\"/>");
        newParticipantRow.append($("<th/>"));
        newParticipantRow.append($("<td/>").append($("<em/>").text(newParticipantSnapshot.val().name)));
        newParticipantRow.append($("<td/>").text(newParticipantSnapshot.val().email));

        newParticipantRow.append($("<td/>").text(newParticipantSnapshot.val().restrictions));

        participantHtmlForPath[newParticipantSnapshot.key()] = newParticipantRow;

        if (prevParticipantName === null) {
            $("#participantTable").append(newParticipantRow);
        }
        else {
            var lowerScoreRow = participantHtmlForPath[prevParticipantName];
            lowerScoreRow.before(newParticipantRow);
        }
    }

    function handleParticipantRemoved(participantSnapshot) {
        if (typeof (participantSnapshot) === "Undefined") {
            return;
        }
        var removedParticipantRow = participantHtmlForPath[participantSnapshot.key()];
        removedParticipantRow.remove();
        delete participantHtmlForPath[participantSnapshot.key()];
    }

    participantsListView.on("child_added", function (newParticipantSnapshot, prevParticipantName) {
        handleParticipantAdded(newParticipantSnapshot, prevParticipantName);
    });

    participantsListView.on('child_removed', function (oldparticipantSnapshot) {
        handleParticipantRemoved(oldparticipantSnapshot);
    });

    var changedCallback = function (participantSnapshot, prevParticipantName) {

        if (typeof (participantSnapshot) === "Undefined" || typeof (prevParticipantName) === "Undefined") {
            return;
        }
        handleParticipantRemoved(participantSnapshot);
        handleParticipantAdded(participantSnapshot, prevParticipantName);
    };
    participantsListView.on('child_moved', changedCallback);
    participantsListView.on('child_changed', changedCallback);
});

// The join room function used by the join room button on the room page
function joinRoom() {
    var name = $("#join_room_name_input").val();
    var email = $("#join_room_email_input").val();
    var restrictions_array = [];
    // technique found on http://marcgrabanski.com/jquery-select-list-values/
    $("#join_restaurant_dietary_restriction_select :selected").each(function (i, selected) { restrictions_array[i] = $(selected).val(); });

    participantsRef.push({ name: name, email: email, restrictions: restrictions_array });
}