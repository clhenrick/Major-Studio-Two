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
				attributionControl: false
			};

		L.Map = L.Map.extend({
		    openPopup: function(popup) {
		        //this.closePopup();
		        this._popup = popup;

		        return this.addLayer(popup).fire('popupopen', {
		            popup: this._popup
		        });
		    }
		});

		//init the map
		this.map = L.map('map', config);
		//disable drag and zoom handlers
		//this.map.dragging.disable();
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
		L.control.attribution({ 
			'position': 'bottomleft'
		}).setPrefix()
		  .addAttribution("Trail Data courtesy of <a href=\"http://www.pctmap.net/\">Half Mile Maps</a>")		  
		  .addTo(this.map);

		this.markers = L.layerGroup().addTo(this.map);		
	},

	checkFeatureClass : function(feature){
		/*** function to detect feature class of marker ***/
		//console.log('checkFeatureClass feature: ', feature);
		var fc = feature.properties.feature_cl;

		var poi = new L.MakiMarkers.icon({
				icon: "star",
				color: "#b0b",
				size: "l"
			}),
			camp = new L.MakiMarkers.icon({
				icon: "campsite",
				color: "#99554E",
				size: "l"
			}),
			town = new L.MakiMarkers.icon({
				icon: "town",
				color: "#D9D9D9",
				size: "l"
			}),				
			event = new L.MakiMarkers.icon({
				icon: "circle",
				color: "#5CDBFF",
				size: "l"
			}),
			peak = new L.MakiMarkers.icon({
				icon: "triangle",
				color: "#99554E",
				size: "l"
			}),				
			site = new L.MakiMarkers.icon({
				icon: "square",
				color: "#6969FF",
				size: "l"
			}),	
			nfwater = new L.MakiMarkers.icon({
				icon: "park",
				color: "#6969FF",
				size: "l"
			}),
			food = new L.MakiMarkers.icon({
				icon: "fast-food",
				color: "#F3FF5F",
				size: "l"
			}),
			lodging = new L.MakiMarkers.icon({
				icon: "lodging",
				color: "#6969FF",
				size: "l"
			}),											
			nf = new L.MakiMarkers.icon({
				icon: "park",
				color: "#35ad22",
				size: "l"
			});

		switch(fc) {
			case 'poi' : return poi; break;
			case 'camp' : return camp; break;
			case 'lodging' : return lodging; break;
			case 'event' : return event; break;
			case 'nf' :  return nf; break;
			case 'peak' : return peak; break;
			case 'town' : return town; break;
			case 'nf_water' : return nfwater; break;
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

		// load poi.geojson data, add event listener for animatedMarker on move
		$.getJSON('data/pct-poi-final.geojson', function(data){
			//console.log('geojson data for POI\'s loaded: ', data);

			features = data.features,
			len = features.length,
			i = 0;

            // check point of interest data for what to add to popups
            var popupContent = function(feature, layer, name, desc, lat, lon) {                    
                if (name && !desc) {
                    return "<h2>" + name + "</h2>";
                } else if (name && desc) {
                    return "<h2>" + name + "</h2>" + "<p>" + desc + "</p>";
                } else if (!name && desc) {
                    return "<p>" + desc + "</p>";
                };
            }

            var onEachFeature = function(feature, layer, animatedMarker){                    
                var name = feature.properties.Name,
                    desc = feature.properties.Descriptio,
                    lat = feature.geometry.coordinates[1],
                    lon = feature.geometry.coordinates[0],
                    popupOptions = {
                    	closebutton : false
                    };                    

                layer.bindPopup(popupContent(feature, layer, name, desc, lat, lon), popupOptions);

                myApp.am.on({'move': function(e){                      
                    // measure distance in pixels from animatedMarker to poi markers
                    var d = L.GeometryUtil.distance(myApp.map, e.latlng, [lat,lon]);
                    
                    // do a distance test to open / close popups
                    if (d < 100) { layer.openPopup(); }
                    if (d > 200) { layer.closePopup(); }
                    }
                });
            };

            var marker = L.geoJson(data, {
            	pointToLayer: function(feature, latlng){
            		var myIcon = myApp.checkFeatureClass(feature);
            		return new L.Marker(latlng, {
            			icon : myIcon,
            		});            		
            	},				           	
            	onEachFeature: function(feature, layer){            		
            		onEachFeature(feature, layer, myApp.am);
            	}
            });

            myApp.markers.addLayer(marker);	
		})
		.done(function() {
			//console.log( "another success! getJSON for POI.geojson is done." );
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
			//console.log("geojson for pct trail loaded: ", data);

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
			// add event listener for animatedMarker lat lon position
			myApp.am.on('move', myApp.checkLatLon);
		})
		.done(function() {
			//console.log( "success! getJSON for pct.geojson is done." );
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
		//console.log('removeLayer called');
		myApp.map.removeLayer(layer);
	},		

	start : function(){
		myApp.am.start();
		myApp.flag = false;
	},

	stop : function(){		
		myApp.flag = true;
		myApp.am.stop();
	},

	pan : function(){
		myApp.map.panTo({
			lon: myApp.am['_latlng'].lng, lat: myApp.am['_latlng'].lat
		});
	}, 

	// jQuery waypoint scroll detection
	onScroll : function() {
		//waypoint offset value
		var w = 60,
			v1 = document.getElementsByTagName("video")[0];
		
		// reveal map to user 
		$('#wp0').waypoint(function(direction){
			switch(direction) {
				case 'down':
					console.log('wp0 called');
					// $('#intro-image').css({'display', 'none'});
					$('#map').css({'z-index': '5'});
					$('#map-placeholder').css({'background-color' : 'hsla(0,100%,100%,0)'});
					break;
				case 'up':
					// $('#intro-image').css('display', 'block');
					$('#map-placeholder').css({'background-color' : 'hsla(0,100%,100%,1)'});
					$('#map').css({'z-index': '-3'});
					break;
			}
		}, {offset: 40});

		// zoom to start and load POI's
		$('#wp1A').waypoint(function(d) {
			switch(d) {
				case 'down':
					$('#map-placeholder').toggleClass('hidden');
					myApp.fetchPoiData();
					myApp.map.zoomIn(6);
					if (myApp.amCounter === -1) { 
						myApp.map.panTo([myApp.coordinates.start[1],myApp.coordinates.start[0]]);
						myApp.amCounter = 0;
					}
					break;
				case 'up':
					$('#map-placeholder').toggleClass('hidden');					
					myApp.map.removeLayer(myApp.markers);
					myApp.map.zoomOut(6);
					if (myApp.amCounter === -1) { myApp.map.panTo([40.3025, -121.2347]);	}
					break;
			}
		}, {offset: w});

		// start animation for chapter 01
		$('#wp1B').waypoint(function(direction) {

			//console.log('direction: ' + direction);

			switch(direction){
				case 'down' :
					//console.log('waypoint 1 triggered');										
					if (myApp.amCounter === 0) { 
						myApp.start();
						myApp.onMove = myApp.startInterval();
						myApp.amCounter +=1;
					} 
					break;
				case 'up' :					
					if (myApp.amCounter === 1) { 
						myApp.amCounter -=1;
						myApp.flag = true;
						//myApp.stop();
					}					
					break;
			}
		}, {offset: 150});

		// start animation for chapter 02
		$('#wp2').waypoint(function(d) {
			switch(d) {
				case 'down':										
					if (myApp.amCounter === 2) { 
						myApp.start();
						myApp.amCounter += 1;
						myApp.onMove = myApp.startInterval();
					} 												
					break;
				case 'up':					
					myApp.stop();
					if (myApp.amCounter === 3){
						myApp.amCounter -= 1;
						myApp.flag = true;
					}										
					break;
			}
		}, {offset: w});

		$('#wp3A').waypoint(function(d) {
			switch(d) {
				case 'down':
					console.log('waypoint 3A down');
					v1.play();
					break;
				case 'up':
					console.log('waypoint 3A up');
					v1.pause();
					break;
			}
		}, {offset: 150});

		$('#wp3B').waypoint(function(d) {
			switch(d) {
				case 'down':
					console.log('waypoint 3B down');
					v1.pause();
					break;
				case 'up':
					console.log('waypoint 3B up');
					v1.play();
					break;
			}
		}, {offset: 50});

		$('#wp4').waypoint(function(d) {
			switch(d) {
				case 'down':					
					console.log('wp4 down');
					if (myApp.amCounter === 4){
						myApp.start();						
						myApp.onMove = myApp.startInterval();
						myApp.amCounter += 1;	
					}
											
					break;
				case 'up':
					if (myApp.amCounter === 5) {
						myApp.amCounter -= 1;
						myApp.stop();
						myApp.flag = true;						
					}											
					break;
			}
		}, {offset: 150});

		$('#wp5').waypoint(function(d) {
			switch(d) {
				case 'down':
					if (myApp.amCounter === 6) {
						myApp.start();
						myApp.flag = false;
						myApp.onMove = myApp.startInterval();
						myApp.amCounter += 1;		
					}					
					break;
				case 'up':
					if (myApp.amCounter === 7) {						
						myApp.stop();
						myApp.flag = true;
						myApp.amCounter -= 1;
					}	

					break;
			}
		}, {offset: 150});

		$('#wp6').waypoint(function(d) {
			switch(d) {
				case 'down':
					if (myApp.amCounter === 8) {
						myApp.start();
						myApp.flag = false;
						myApp.onMove = myApp.startInterval();
						myApp.amCounter += 1;		
					}					
					break;
				case 'up':
					if (myApp.amCounter === 9) {
						myApp.stop();
						myApp.flag = true;
						myApp.amCounter -= 1;
					}					
					break;
			}
		}, {offset: 150});

		// $('#wp..').waypoint(function(d) {
		// 	switch(d) {
		// 		case 'down':
		// 			if (myApp.flag === true) {
		// 				myApp.start();
		// 				myApp.flag = false;
		// 				myApp.onMove = myApp.startInterval();		
		// 			}					
		// 			break;
		// 		case 'up':
		// 			if (myApp.flag === false) {
		// 				myApp.stop();
		// 				myApp.flag = true;
		// 			}					
		// 			break;
		// 	}
		// }, {offset: 150});		
	},

	flag: false,

	// return setInterval ID and clear it when animatedMarker stops
	startInterval : function() {
		return setInterval(function(){
			if (myApp.flag === true){
				myApp.stop();				
				clearInterval(myApp.onMove);			
			}
		},1000);
	},

	onMove : null,

	amCounter : -1,

	// latlng coordinates for when to stop animatedMarker
	coordinates : { 
		start: [-116.46695, 32.589707], 
		one : [-116.645282, 33.273054],
		two : [-116.671629, 33.757491], 
		three : [-116.917108, 34.2842],
		four: [-117.647582, 34.338275],
		five: [-118.35886, 35.051991]
	},	

	// function to check coordinates with animatedMarker position
	// increment amCounter when coordinates match
	checkLatLon : function(e) {
		var lat0 = myApp.coordinates.start[1],
			lng0 = myApp.coordinates.start[0],
			lat1 = myApp.coordinates.one[1],
			lng1 = myApp.coordinates.one[0],
			lat2 = myApp.coordinates.two[1],
			lng2 = myApp.coordinates.two[0],
			lat3 = myApp.coordinates.three[1],
			lng3 = myApp.coordinates.three[0],
			lat4 = myApp.coordinates.four[1],
			lng4 = myApp.coordinates.four[0],
			lat5 = myApp.coordinates.five[1],
			lng5 = myApp.coordinates.five[0];		

		switch(e.latlng.lng, e.latlng.lat) {
			case lng0, lat0 :
				myApp.amCounter = 0;
				break;
			case lng1, lat1 :
				myApp.flag = true;
				myApp.amCounter = 2;
				break;
			case lng2, lat2 :				
				myApp.flag = true;
				myApp.stop();
				myApp.amCounter = 4;
				break;
			case lng3, lat3:
				myApp.flag = true;
				myApp.stop();
				myApp.amCounter = 6;
				break;
			case lng4, lat4:
				myApp.flag = true;
				myApp.stop();
				myApp.amCounter = 8;
				break;
			case lng5, lat5:
				myApp.flag = true;
				myApp.stop();
				myApp.amCounter = 10;
				break;								
		}

		myApp.pan();

	},

	init : function() {
		console.log('called myApp.init()');
		//draw map
		myApp.renderMap();
		//async load geo data
		myApp.fetchData();
		//attach scroll events
		//start tracking the marker for lat/long pos
		myApp.onMove = myApp.startInterval();
		//myApp.onPan = setInterval(myApp.pan, 100);
		// add event listener for user scrolling
		myApp.onScroll();
	}
} //end myApp


window.onload = myApp.init;
