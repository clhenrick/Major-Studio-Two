console.log($(document).width());

// pct center point is 40.3025, -121.234722

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


});


// temporary button interaction code here
var clicked = false;

$('#button').click(function(){
	// for now set button to start / stop animated marker
	// also set zoom to larger scale?
	// eventually replace button with scrolling functionality 
	
	// use a setInterval function to have the map follow the marker
	var fps = 100,
	mapPanTo = setInterval(function(){map.panTo({lon: animatedMarker['_latlng'].lng, lat: animatedMarker['_latlng'].lat})}, fps);
	
	//check to see if button has been clicked
	if (clicked === false){
		animatedMarker.start();
		clicked = true;
		
		//zoom in by a factor of 6
		map.zoomIn(6);
		
	} else if (clicked === true) {
		animatedMarker.stop();
		clicked = false;

		//zoom out by a factor of 6
		map.zoomOut(6);
	}

});

// TO DO: namespace for marker control
markerCntrl = {

	coordinates : { //arbitrary for testing
		1 : [-116.46705135909554, 32.59236807198289],
		2 : [-116.46672634267014, 32.59659328551297],
		3 : [-116.4696108634455, 32.59894965459705]
	},
	start : animatedMarker.start(),
	stop : animatedMarker.stop()

}











