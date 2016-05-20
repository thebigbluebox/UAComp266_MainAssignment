// This example requires the Places library. Include the libraries=places
// This file is taken from Google Maps API as a demo for Places Autocomplete feature
// https://developers.google.com/maps/documentation/javascript/places-autocomplete#introduction
var coord;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.6532, lng: -79.3832 },
        zoom: 13
    });
    // The autocomplete input
    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input'));
    
    // Forces the input to be on the top left of the map
    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    // The actualy binding of the auto complete
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("This location is not properly addressed");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        
        // The actual marker of the location that is found
        marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        coord = place.geometry.location.toJSON();
        var address = '';
        
        // Setting the info window tab to for the marker
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });
}