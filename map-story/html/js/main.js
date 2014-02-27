myApp = {

	map : null,
	am : null,
	markers : null,

	renderMap : function(){
		//console.log('this: ', this);
		var config = {
				baselayer: new L.StamenTileLayer('terrain'),
				initLatLng: new L.LatLng(40.3025, -121.2347),
				initZoom: 5,
				minZoom: 4,
				maxZoom: 16,
				zoomControl: false,
				attributionControl: true
			};
		//init the map
		this.map = L.map('map', config);
		//disable drag and zoom handlers
		this.map.dragging.disable();
		this.map.touchZoom.disable();
		this.map.doubleClickZoom.disable();
		this.map.scrollWheelZoom.disable();
		// disable tap handler, if present.
		if (this.map.tap) this.map.tap.disable();
		// add the Stamen terrain basemap layer
		this.map.addLayer(config.baselayer);
		// set init map center and zoom level
		this.map.setView(config.initLatLng, config.initZoom);
		// place attribution in bottom left so it's visible
		new L.Control.Attribution({ position: 'bottomleft'}).addTo(this.map);
	},

	fetchData : function(){
		var features,
			len,
			i,
			lat,
			lon,
			poi;

		// load poi.geojson data
		$.getJSON('data/pct-poi-subset.geojson', function(data){
			console.log('geojson data for POI\'s loaded: ', data);

			features = data.features,
			len = features.length,
			i = 0;
			console.log('Fetch data says: features: ', features, ' len is: ', len);

			for (i; i<len; i++){
				lat = features[i].geometry.coordinates[1];
				lon = features[i].geometry.coordinates[0];
				poi = new L.MakiMarkers.icon({
					icon: "star",
					color: "#b0b",
					size: "s"
				});
				myApp.markers = new L.Marker([lat,lon],{
					icon: poi
				}).bindPopup("<h2>Point of Interest</h2>");

				// add the poi markers to the map
				//myApp.addLayer(myApp.markers);
			}	
		})
		.done(function() {
			console.log( "another success! getJSON for POI.geojson is done." );
		})
		.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		})    
		.always(function() {
			// run this stuff after, regardless of success or failure
		}); // end $.getJSON(poi.geojson);

		// add PCT line feature from external geojson file
		$.getJSON("data/pct.geojson", function(data) {
			console.log("geojson for pct trail loaded: ", data);

			var myStyle = {
				"color": "#9400ff",
				"weight": 4,
				"opacity": 0.7,
				"smoothFactor": 2
				},
				temp = [];
			
			// loop through geojson data and push the lat lon values to line array
			for (d in data) {
				var i = 0,
					l = data.features.length;
				for (i; i < l; i ++){
					var j = 0,
						coordinates = data.features[i].geometry.coordinates,
						cLen = coordinates.length;
					for (j; j<cLen; j++){
						var reverseCoordinates = [];
							//reverse the order of lat lon as leaflet reads lon then lat
						reverseCoordinates.push(coordinates[j][1]);
						reverseCoordinates.push(coordinates[j][0]);
						temp.push(reverseCoordinates);
					}
				}
			} // end outer for loop

			var line = L.polyline(temp);
			myApp.am = L.animatedMarker(line.getLatLngs(), {
					autoStart: false,
					distance: 500,
					interval: 1000
				});
			// add the animated marker
			myApp.map.addLayer(myApp.am);
			// add pct line geojson layer
			var pctLine = L.geoJson(data, {
					style : myStyle
				}).addTo(myApp.map); 
			// add event listener for user scrolling
			myApp.onScroll();
			// add event listener for animatedMarker lat lon position
			myApp.am.on('move', myApp.checkLatLon);
		})
		.done(function() {
			console.log( "success! getJSON for pct.geojson is done." );
		})
		.fail(function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		})    
		.always(function() {
			// run this stuff after, regardless of success or failure
		}); // end $.getJSON(pct.geojson);

	},

	add : function(layer){
		myApp.map.addLayer(layer);
	},

	rm : function(layer){
		myApp.map.removeLayer(layer);
	},

	coordinates : { //arbitrary right now for testing
		start: [-116.46694979146261, 32.589707],
		one : [-116.46705135909554, 32.59186023381822],
		two : [-116.46672634267014, 32.59659328551297],
		three : [-116.4696108634455, 32.59894965459705]
	},

	flag: false,

	start : function(){
		this.am.start();
	},

	stop : function(){
		this.am.stop();		
	},

	pan : function() {
		var fps = 100;
		setInterval(function(){
			myApp.map.panTo({lon: myApp.am['_latlng'].lng, lat: myApp.am['_latlng'].lat})
		},fps);
	},

	onScroll : function() {
		console.log('this.coordinates.one[0]: ' + myApp.coordinates.one[0]);
		
		$('#wp0').waypoint(function(direction){
			switch(direction) {
				case 'down':
					$('#map').css({'z-index': '5'});
					$('#map-placeholder').css({'background-color' : 'hsla(0,100%,100%,0)'});
					break;
				case 'up':
					$('#map-placeholder').css({'background-color' : 'hsla(0,100%,100%,1)'});
					$('#map').css({'z-index': '-3'});
					break;
			}
		}, {offset: 50});

		// detect user scrolling to first chapter
		$('#wp1').waypoint(function(direction) {

			console.log('direction: ' + direction);

			switch(direction){
				case 'down' :
					myApp.add(myApp.markers);					
					myApp.map.zoomIn(6);
					myApp.start();
					myApp.pan();
					break;
				case 'up' :
					myApp.rm(myApp.markers);
					myApp.map.zoomOut(6);
					myApp.stop();
					break;
			}
		}, {offset: 50});
	},

	onMove : setInterval(function(e){
		if (myApp.flag === true){
			myApp.am.stop();
			myApp.add(myApp.markers);					
			clearInterval(myApp.onMove);
		}
	},100),

	checkLatLon : function(e) {
		var lat1 = myApp.coordinates.one[1],
			lng1 = myApp.coordinates.one[0];
		if (e.latlng.lng === lng1 && e.latlng.lat === lat1){
			// alert("whoa!"); //works
			console.log("lat lon check worked!");
			//myApp.flag = true;
			//myApp.stop();
		}
	},

	init : function() {
		console.log('here we go');
		//draw map
		myApp.renderMap();
		//async load geo data
		myApp.fetchData();
		//attach scroll events
		//start tracking the marker for lat/long pos
		myApp.onMove;
	}
} //end myApp


window.onload = myApp.init;
