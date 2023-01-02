// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude ${feature.properties.mag} - Depth ${feature.geometry.coordinates[2]}</p><hr><p>${new Date(feature.properties.time)}</p>`);
    // console.log(feature.geometry.coordinates[2])
  }
  
  // create function for circle style
  function circleStyle(geoJsonPoint){
    return {
    color: "black",
    // color: circleColor(geoJsonPoint.geometry.coordinates[2]),
    fillColor: circleColor(geoJsonPoint.geometry.coordinates[2]),
    fillOpacity: 1,
    radius: circleSize(geoJsonPoint.properties.mag),
    weight: 1
    }
  }

    //circle size
  function circleSize(magnitude){
    if (magnitude === 0) {
        return 1;
      }
      return magnitude * 3;
  }
  
//   // circle color
  function circleColor(depth){
    
    if (depth > 500) {
        return 'red'
      } else if (depth > 400) {
        return 'darkorange'
      } else if (depth > 300) {
        return 'tan'
      } else if (depth > 200) {
        return 'yellow'
      } else if (depth > 100) {
        return 'darkgreen'
      } else {
        return ' lightgreen'
      }
    
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(geoJsonPoint, latlng) {
        return L.circleMarker(latlng);
        },
    style: circleStyle
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  //Create legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        depthlevel = [0, 100, 200, 300, 400, 500];

        div.innerHTML += "<h3>Depth</h3>"

        for (var i = 0; i < depthlevel.length; i++) {
          
            div.innerHTML +=
                '<div><i style="background:' + circleColor(depthlevel[i] + 1) + '"></i> ' +
                depthlevel[i] + (depthlevel[i + 1] ? '&ndash;' + depthlevel[i + 1] + '<br></div>' : '+');
        }
        return div;
    
    };

  // Add legend to the map
  legend.addTo(myMap);


  //   // circle color
  function circleColor(depth){
    
    if (depth > 500) {
        return 'red'
      } else if (depth > 400) {
        return 'darkorange'
      } else if (depth > 300) {
        return 'tan'
      } else if (depth > 200) {
        return 'yellow'
      } else if (depth > 100) {
        return 'darkgreen'
      } else {
        return ' lightgreen'
      }
    
  }

}
