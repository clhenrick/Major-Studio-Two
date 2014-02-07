// Leaflet Stuff:
// PCT center point is 40.3025, -121.234722

// store map config variables in an object
var config = {
  baselayer: new L.StamenTileLayer('terrain'),
  initLatLng: new L.LatLng(40.3025, -121.2347),
  initZoom: 5,
  minZoom: 4,
  maxZoom: 16
}

// initialize map
var map = L.map('map', {minZoom: config.minZoom, maxZoom: config.maxZoom})

// add the Stamen base layer to the map 
map.addLayer(config.baselayer);

// set init map center and zoom
map.setView(config.initLatLng, config.initZoom);

L.control.attribution({'position': 'bottomleft'}).addTo(map);


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

				//reverse them as leaflet reads lon then lat
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

	var onMove = function(e){
		//e.preventDefault();
		//console.log('this: ' + this.getLatLng() + 'this properties: ' + this);
		var lat1 = markerCntrl.coordinates.one[0],
			lng1 = markerCntrl.coordinates.one[1];

		console.log('e.latlng.lat: ' + e.latlng.lat + 'e.latlng.lng: ' + e.latlng.lng);
		if (e.latlng.lng === markerCntrl.coordinates.one[0] && e.latlng.lat === markerCntrl.coordinates.one[1]){
				//alert("whoa!"); //works
			}
		}

	animatedMarker.on('move', onMove);

});



// namespace for marker control
markerCntrl = {

	coordinates : { //arbitrary right now for testing
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

	latLonCheck : function(){
		if (animatedMarker['_latlng'].lng === markerCntrl.coordinates.one[0] && animatedMarker['_latlng'].lat === markerCntrl.coordinates.one[1]){
			animatedMarker.stop();
		};
		
	},

	run : function() {
		console.log('this.coordinates.one[0]: ' + markerCntrl.coordinates.one[0]);
	
		$('#wp1').waypoint(function(direction) {

			console.log('direction: ' + direction);

			switch(direction){
				case 'down' :
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
					break;
			}

		}, {offset: 100});

		// check to see if marker will stop at specified coordinates
	}
}






