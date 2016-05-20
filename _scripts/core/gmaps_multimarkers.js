// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
// This file is referenced from Google's map api
// https://developers.google.com/maps/documentation/javascript/examples/marker-remove
var map;
// roomMarker will be set by the room_essentials.js when it passes the room's marker location
var roomMarker = {};
var restaurantLocations = [];
var markers = [];
var infos = [];

// Solution provided by http://jsfiddle.net/ZFvDV/

function initMap() {
  var roomLocation = { lat: 43.5890452, lng: -79.6441198 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: roomLocation,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Adds a marker at the center of the map.
  addMarker(roomLocation);

  setMarkers(map, markers);
}
// Sets a set of markers solution from http://jsfiddle.net/ZFvDV/
function setMarkers(map, markers) {
  var marker;
  for (var i; i < restaurantLocations.length; i++) {
    var restaurantName = restaurantLocations[i].val().name;
    addMarker(restaurantLocations[i].lnglat, restaurantName);
    var content = "<p>" + restaurantName + "</p>";
    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, "click",
      (function (marker, content, infoWindow) {
        return function () {
          closeInfos();

          infoWindow.setContent(content);
          infoWindow.open(map, marker);

          infos[0] = infoWindow;
        };
      })(marker, content, infoWindw));
  }
}
// Sets a single marker instead of a set of markers
function setMarker(map, marker) {
    var restaurantName = marker.restaurantName;
    var markerObj = addMarker(marker.lnglat, restaurantName);
    var content = "<h3>" + restaurantName + "</h3>";
    var infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(markerObj, "click",
      (function (markerObj, content, infoWindow) {
        return function () {
          closeInfos();

          infoWindow.setContent(content);
          infoWindow.open(map, markerObj);

          infos[0] = infoWindow;
        };
      })(markerObj, content, infoWindow));
}

// Closes infotabs that are open
function closeInfos() {

  if (infos.length > 0) {

    infos[0].set("marker", null);
    infos[0].close();

    infos.length = 0;
  }
}

// Returns a marker object
function addMarker(location, title) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: title
  });
  return marker;
}