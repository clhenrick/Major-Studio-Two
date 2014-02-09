// Leaflet Stuff:
// PCT center point is 40.3025, -121.234722

// store map config variables in an object
var config = {
  baselayer: new L.StamenTileLayer('terrain'),
  initLatLng: new L.LatLng(40.3025, -121.2347),
  initZoom: 5,
  minZoom: 4,
  maxZoom: 16,
  zoomControl: false,
  attributionControl: false
}

// initialize map
var map = L.map('map', {minZoom: config.minZoom, maxZoom: config.maxZoom, zoomControl: false, attributionControl: false})

// disable drag and zoom handlers
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
// disable tap handler, if present.
if (map.tap) map.tap.disable();

// add the Stamen base layer to the map 
map.addLayer(config.baselayer);

// set init map center and zoom
map.setView(config.initLatLng, config.initZoom);

// place attribution in bottom left so it's visible
// ** not working :( 
new L.Control.Attribution({ position: 'bottomleft'}).addTo(map);

// add PCT line feature from external geojson file
$.getJSON("data/pct.geojson", function(data) {
	
	console.log("geojson file loaded");
	
	// styles to pass to 
	var myStyle = {
		"color": "#9400ff",
		"weight": 4,
		"opacity": 0.7,
		"smoothFactor": 2
	}
	
	// array to store lat lon values for animatedMarker
	var temp = [];

	// loop through geojson data and push the lat lon values to line array
	for (d in data) {
		console.log(data);
		var i = 0,
			len = data.features.length;
		for (i; i < len; i ++){
			//console.log(data.features[i])
			var j = 0,
				coordinates = data.features[i].geometry.coordinates,
				cLen = coordinates.length;
			for (j; j<cLen; j++){
				//console.log(coordinates[j]);
				var reverseCoordinates = [];

				//reverse the order of lat lon as leaflet reads lon then lat
				reverseCoordinates.push(coordinates[j][1]);
				reverseCoordinates.push(coordinates[j][0]);
				temp.push(reverseCoordinates);
			}
		}
	}
	
	// add pct lat lon points for the marker to animate
	var line = L.polyline(temp);
	animatedMarker = L.animatedMarker(line.getLatLngs(), {
			autoStart: false,
			distance: 2000,
			interval: 1000
		});

	map.addLayer(animatedMarker);


	//When GeoJSON is loaded
	var geojsonLayer = L.geoJson(data, {
			style: myStyle
		}).addTo(map); //Add layer to map	

	// grab the animated marker lat lon values (note: they are constantly changing)
	console.log(animatedMarker['_latlng'].lat);
	console.log(animatedMarker['_latlng'].lng);
	console.log(animatedMarker);

	// start browser panning interactivity:
	markerCntrl.run();

	// .on = action is turned on .off = action is turned off
	animatedMarker.on('move', markerCntrl.onMove);

});



// namespace for marker control
markerCntrl = {

	coordinates : { //arbitrary right now for testing
		start: [-116.46694979146261, 32.589707],
		one : [-116.46705135909554, 32.59186023381822],
		two : [-116.46672634267014, 32.59659328551297],
		three : [-116.4696108634455, 32.59894965459705]
	},
	start : function(){
		animatedMarker.start();
	},
	stop : function(){
		animatedMarker.stop();
	},

	pan : function() {
		var fps = 100;
		setInterval(function(){
			map.panTo({lon: animatedMarker['_latlng'].lng, lat: animatedMarker['_latlng'].lat})
		},fps)
	},

	zoomIn : function(factor){
		map.zoomIn(factor);
	},

	zoomOut : function(factor){
		map.zoomOut(factor);
	},

	run : function() {
		console.log('this.coordinates.one[0]: ' + markerCntrl.coordinates.one[0]);
	
		$('#wp1').waypoint(function(direction) {

			console.log('direction: ' + direction);

			switch(direction){
				case 'down' :
					//animatedMarker.setLatLng({lat: markerCntrl.coordinates.start[1], lon: markerCntrl.coordinates.start[0]})				
					map.zoomIn(6);
					animatedMarker.start();
			  		var fps = 100,
						panTo = setInterval(function(){
							map.panTo({lon: animatedMarker['_latlng'].lng, lat: animatedMarker['_latlng'].lat})
						},fps);
					break;
				case 'up' :
					map.zoomOut(6)
					animatedMarker.stop();
					//animatedMarker.setLatLng({lat: markerCntrl.coordinates.start[1], lon: markerCntrl.coordinates.start[0]})
					break;
			}

		}, {offset: 100});

	},

	onMove : function(e){
		var lat1 = markerCntrl.coordinates.one[1],
			lng1 = markerCntrl.coordinates.one[0];

		// log e / this properties to debug
		console.log('e.latlng.lat: ' + e.latlng.lat + ' e.latlng.lng: ' + e.latlng.lng);
		console.log('e is: ' + e);
		console.log('lat1: ' + lat1);
		console.log('lng1: ' + lng1);
		console.log('this latlon.lat: ' + this['_latlng'].lat);
		console.log('this latlon.lng: ' + this['_latlng'].lng);

		if (e.latlng.lng === lng1 && e.latlng.lat === lat1){
				//alert("whoa!"); //works
				console.log("lat lon check worked!");
				//animatedMarker.setLatLng({lat: lat1, lon: lng1}); // works but then animateMarker.start() won't work
				//animatedMarker.stop(); // doesn't work, not sure why. Possibly due to a conflict with JQuery Waypoints?
				
				// thought this was working but apparently not
				e.latlng.lat = lat1;
				e.latlng.lng = lng1;
			}
	}
}






