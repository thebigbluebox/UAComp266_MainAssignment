$(document).ready(function () {
    var PARTICIPANTLIST_SIZE = 10;
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
        
        // var AllergenTags = newParticipantSnapshot.val().restrictions;
        // var allergenTagHtmlText = '';
        // for(var x in AllergenTags) {
            
        // }
        newParticipantRow.append($("<td/>").text(newParticipantSnapshot.val().restrictions));

        // Store a reference to the table row so we can get it again later.
        participantHtmlForPath[newParticipantSnapshot.key()] = newParticipantRow;

        // Insert the new score in the appropriate place in the table.
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
    
    $("#join_room_button").click(function (e) {
        var name = $("#join_name_input").val();
        // $("#join_name_input").val("");
        var email = $("#join_email_input").val();
        // $("#join_email_input").val("");
        var restrictions_array = [];
        // technique found on http://marcgrabanski.com/jquery-select-list-values/
        $("#join_restaurant_dietary_restriction_select :selected").each(function (i, selected) { restrictions_array[i] = $(selected).val();});

        participantsRef.push({ name: name, email: email, restrictions: restrictions_array });
    });
});