// store map config variables in an object
var config = {
  baselayer: new L.StamenTileLayer('terrain'),
  initLatLng: new L.LatLng(40.67, -73.94),
  initZoom: 12,
  minZoom: 11,
  maxZoom: 16
}

// initialize map
var map = L.map('map', {minZoom: config.minZoom, maxZoom: config.maxZoom})

// add the Stamen base layer to the map 
map.addLayer(config.baselayer);

// set init map center and zoom
map.setView(config.initLatLng, config.initZoom);