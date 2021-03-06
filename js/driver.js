// Initial Map
function initAutocomplete() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -37.8,
            lng: 145.0
        },
        zoom: 11,
        minZoom: 2,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl: false
    });

    var input_departure = document.getElementById('input_departure');
    var input_arrival = document.getElementById('input_arrival');
    var input_area = document.getElementById('input_area');

    initMapComponent(map, input_departure, input_arrival, input_area);
}

// Refresh Map Component
function initMapComponent(map, input_departure, input_arrival, input_area) {

    // Add listener for map size change
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    // Add Controls panel
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input_area);

    var searchBox_departure = new google.maps.places.SearchBox(input_departure);
    var searchBox_arrival = new google.maps.places.SearchBox(input_arrival);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox_departure.setBounds(map.getBounds());
        searchBox_arrival.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    // Search Box for departure
    searchBox_departure.addListener('places_changed', function () {

        var places = searchBox_departure.getPlaces();

        if (places.length == 0)
            return;

        if (markers.length > 2) {
            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport)
            // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            else
                bounds.extend(place.geometry.location);
        });
        map.fitBounds(bounds);
    });


    // Search Box for arrival
    searchBox_arrival.addListener('places_changed', function () {
        var places = searchBox_arrival.getPlaces();

        if (places.length == 0)
            return;

        if (markers.length > 2) {
            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport)
            // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            else
                bounds.extend(place.geometry.location);
        });
        map.fitBounds(bounds);
    });
}

// Search button click
function search() {

    var input_departure = document.getElementById('input_departure');
    var input_arrival = document.getElementById('input_arrival');
    var input_time = document.getElementById('input_time');
    var input_seat = document.getElementById('input_seat');
    var input_area = document.getElementById('input_area');

    if (input_departure.value == '') {
        swal("Please enter Departure position.");
        input_departure.focus();
        return;
    }

    if (input_arrival.value == '') {
        swal("Please enter Arrival position.");
        input_arrival.focus();
        return;
    }

    if (input_time.value == '') {
        swal("Please select your Departure time.");
        input_time.focus();
        return;
    }

    if (input_seat.value == '') {
        swal("Please provide your vacant seat.");
        input_seat.focus();
        return;
    }

    // Refresh Map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -37.8,
            lng: 145.0
        },
        zoom: 11,
        minZoom: 2,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl: false
    });

    initMapComponent(map, input_departure, input_arrival, input_area);

    // Dispaly passenger path
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map
    });

    directionsDisplay.addListener('directions_changed', function () {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    displayRoute(input_departure.value, input_arrival.value, directionsService,
        directionsDisplay);

    // Display Result
    openNav();
}


function displayRoute(origin, destination, service, display) {
    service.route({
        origin: origin,
        destination: destination,
        //          waypoints: [{location: 'Melbourne, VIC'}, {location: 'Broken Hill, NSW'}],
        travelMode: 'DRIVING',
        avoidTolls: true
    }, function (response, status) {
        if (status === 'OK') {
            display.setDirections(response);
            //console.log(response);
        } else {
            //            alert('Could not display directions due to: ' + status);
        }
    });
}

// For computer driver distance
function computeTotalDistance(result) {
    var input_departure = document.getElementById('input_departure');
    var input_arrival = document.getElementById('input_arrival');
    var input_time = document.getElementById('input_time');
    var input_seat = document.getElementById('input_seat');

    var distance = 0;
    var myroute = result.routes[0];
    var duration = 0;

    for (var i = 0; i < myroute.legs.length; i++) {
        distance += myroute.legs[i].distance.value;
        duration += myroute.legs[i].duration.value;
    }
    distance = distance / 1000;

    // Get departure timestamp
    var departureTimeStamp = moment(input_time.value.toString()).unix();

    // Get arrival time
    var arrivelDateTime = moment(input_time.value.toString(), 'DD/MM/YYYY HH:mm').add(duration, 's').format('DD/MM/YYYY HH:mm');
    // Get arrival timestamp
    var arrivelTimeStamp = moment(arrivelDateTime).unix();

    //    console.log(departureTimeStamp);
    //    console.log(arrivelTimeStamp);

    document.getElementById('right_result').innerHTML = "<h3 class='head'>From:</h3><h4>" + input_departure.value + "</h4>" +
        "<h3 class='head'>To:</h3><h4>" + input_arrival.value + "</h4><br><hr>" +
        "<h3 class='head'>Distance:</h3><h4>" + distance + " km</h4><br>" +
        "<h3 class='head'>Departure Time: </h3><h4>" + input_time.value + "</h4>" +
        "<h3 class='head'>Arrival Time: </h3><h4>" + arrivelDateTime + "</h4>" +
        "<h3 class='head'>Duration: </h3><h4>" + Math.round(duration / 60 * 100) / 100 + " mins</h4><br>" +
        "<h3 class='head'>Vacant Seats: </h3><h4>" + input_seat.value + "</h4>";

    addDate(input_departure.value, input_arrival.value, departureTimeStamp, arrivelTimeStamp, input_seat.value);
}

function addDate(from, to, start, end, seat) {
    $.post("action.php", {
            action: "addPath",
            username: "driver_1",
            from: from,
            to: to,
            start: start,
            end: end,
            seat: seat
        },
        function (data, status) {
            console.log("Data: " + data + "\nStatus: " + status);
        });
}
