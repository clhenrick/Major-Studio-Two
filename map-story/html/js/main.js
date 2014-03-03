myApp = {

	that : this,
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

	checkFeatureClass : function(feature){
		/*** function to detect feature class of marker ***/
		//console.log('checkFeatureClass feature: ', feature);
		var fc = feature.properties.feature_cl;

		var 	poi = new L.MakiMarkers.icon({
					icon: "star",
					color: "#b0b",
					size: "m"
				}),
				camp = new L.MakiMarkers.icon({
					icon: "campsite",
					color: "#99554E",
					size: "m"
				}),
				town = new L.MakiMarkers.icon({
					icon: "town",
					color: "#D9D9D9",
					size: "m"
				}),				
				event = new L.MakiMarkers.icon({
					icon: "circle",
					color: "#5CDBFF",
					size: "m"
				}),
				peak = new L.MakiMarkers.icon({
					icon: "triangle",
					color: "#99554E",
					size: "m"
				}),				
				site = new L.MakiMarkers.icon({
					icon: "square",
					color: "#6969FF",
					size: "m"
				}),	
				nfwater = new L.MakiMarkers.icon({
					icon: "park",
					color: "#6969FF",
					size: "m"
				}),
				food = new L.MakiMarkers.icon({
					icon: "fast-food",
					color: "#F3FF5F",
					size: "m"
				}),
				lodging = new L.MakiMarkers.icon({
					icon: "lodging",
					color: "#6969FF",
					size: "m"
				}),											
				nf = new L.MakiMarkers.icon({
					icon: "park",
					color: "#35ad22",
					size: "m"
				});

		switch(fc) {
			case 'poi' : return poi; break;
			case 'camp' : return camp; break;
			case 'lodging' :  return lodging; break;
			case 'event' :  return event; break;
			case 'nf' :  return nf; break;
			case 'peak' :  return peak; break;
			case 'town' :  return town; break;
			case 'nf_water' :  return nfwater; break;
			case 'site' : return site; break;
			case 'food' : return food; break;
			default :  return poi;				
		}		
	},

	fetchPoiData : function(){
		var features,
			len,
			i,
			lat,
			lon,
			icon,
			name,
			desc,
			marker;
		// create a layerGroup to store each marker	
		myApp.markers = L.layerGroup().addTo(myApp.map);

		// load poi.geojson data
		$.getJSON('data/pct-poi-final.geojson', function(data){
			console.log('geojson data for POI\'s loaded: ', data);

			features = data.features,
			len = features.length,
			i = 0;
			//	console.log('Fetch data says: features: ', features, ' len is: ', len);

			for (i; i<len; i++){
				lat = features[i].geometry.coordinates[1];
				lon = features[i].geometry.coordinates[0];
				myIcon = myApp.checkFeatureClass(features[i]);
				name = features[i].properties.Name;
				desc = features[i].properties.Descriptio;

				marker = new L.Marker([lat,lon],{
					icon: myIcon
				}).bindPopup("<h2>" + name + "</h2>" + "<p>" + desc + "</p>");				
				
				myApp.markers.addLayer(marker);
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
	},

	fetchData : function(){
		// add PCT line feature from external geojson file
		$.getJSON("data/pct-simp.geojson", function(data) {
			console.log("geojson for pct trail loaded: ", data);

			var myStyle = {
				"color": "#9400ff",
				"weight": 4,
				"opacity": 0.7,
				"smoothFactor": 2
				},
				temp = [];
			
			// for Animated Marker JS
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

			var mike = new L.MakiMarkers.icon({
					icon: "pitch",
					color: "#FF9126",
					size: "l"
				});

			var line = L.polyline(temp);
			myApp.am = L.animatedMarker(line.getLatLngs(), {
					autoStart: false,
					distance: 5000,
					interval: 1000,
					icon: mike
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
		console.log('removeLayer called');
		myApp.map.removeLayer(layer);
	},

	flag: false,

	start : function(){
		this.am.start();
		this.flag = false;
	},

	stop : function(){
		this.am.stop();
		this.flag = true;
	},

	pan : function() {
		var fps = 100;
		setInterval(function(){
			myApp.map.panTo({lon: myApp.am['_latlng'].lng, lat: myApp.am['_latlng'].lat})
		},fps);
	},

	// jquery waypoint detection
	onScroll : function() {
		/*** jquery waypoint event liste ***/
		//waypoint offset value
		w = 60;
		
		// reveal map to user 
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
		}, {offset: w});

		// zoom to start and load POI's
		$('#wp1A').waypoint(function(d) {
			switch(d) {
				case 'down':
					myApp.fetchPoiData();
					myApp.map.zoomIn(6);
					myApp.map.panTo([myApp.coordinates.start[1],myApp.coordinates.start[0]]);
					break;
				case 'up':
					myApp.map.removeLayer(myApp.markers);
					myApp.map.zoomOut(6);
					myApp.map.panTo([40.3025, -121.2347]);
					myApp.am['_latlng'].lat = myApp.coordinates.start[1];
					myApp.am['_latlng'].lon = myApp.coordinates.start[0];
					break;
			}
		}, {offset: w});

		// start animation for chapter 01
		$('#wp1').waypoint(function(direction) {

			console.log('direction: ' + direction);

			switch(direction){
				case 'down' :
					console.log('waypoint 1 triggered');										
					myApp.start();
					myApp.pan();
					break;
				case 'up' :					
					myApp.stop();
					break;
			}
		}, {offset: w});

		// start animation for chapter 02
		$('#wp2').waypoint(function(d) {
			switch(d) {
				case 'down':
					console.log('waypoint 2 down');
					if (myApp.flag === true) {
						myApp.start();
						myApp.flag = false;					
					}
					break;
				case 'up':
					if (myApp.flag === false) {
						myApp.stop();
						myApp.flag = true;
					}
					break;
			}
		}, {offset: w});

		// detect next event template
		// $('#wp..').waypoint(function(d) {
		// 	switch(d) {
		// 		case 'down':
					
		// 			break;
		// 		case 'up':
					
		// 			break;
		// 	}
		// });
	},

	onMove : setInterval(function(e){
		// myApp.am.on('move', myApp.checkLatLon);
		if (myApp.flag === true){
			myApp.stop();				
			clearInterval(myApp.onMove);
		}
	},100),

	coordinates : { // for detecting animatedMarker pos
		start: [-116.46694979146261, 32.589707], 
		one : [-116.64528224136913, 33.27305403438382],
		two : [-116.67162888535236, 33.75749101642857], 
		three : [-116.4696108634455, 32.59894965459705]
	},	

	checkLatLon : function(e) {
		var lat1 = myApp.coordinates.one[1],
			lng1 = myApp.coordinates.one[0],
			lat2 = myApp.coordinates.two[1],
			lng2 = myApp.coordinates.two[0];

		switch(e.latlng.lng, e.latlng.lat) {
			case lng1, lat1 :
				myApp.flag = true;
				break;
			case lng2, lat2 :
				console.log('lat2, lng2 triggered');
				myApp.flag = true;
				myApp.stop();
				break;
			// case lng3, lat3:
			// 	myApp.flag = true;
			// 	break;
		}
	},

	init : function() {
		console.log('called myApp.init()');
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
