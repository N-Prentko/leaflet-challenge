// nPrentko

// Declare a variable called earthquakeAPI and assign it the value of the url for the 30 day earthquake data
let earthquakeAPI = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Establish produceMap function
produceMap(earthquakeAPI);


// Turn map data into a visualization via function
function produceMap(earthquakeAPI) {

  // Use d3.json function to call data from earthquakeAPI
  d3.json(earthquakeAPI, function(earthquakeData) {
    
    // Send results for the call to console for verification
    console.log(earthquakeAPI)
      
      // Take the data from the call and store it in a new variable
      let API_Data = earthquakeData;

    
        // Insert new variable into a new function called renderFeatures
        renderFeatures(API_Data);
      });

  // Assign new function procedures and attributes 
  function renderFeatures(API_Data) {

    // Create a function that will produce a marker for every earthquake
    function earthquakeMarker(eMarker) {
      return L.circleMarker([eMarker.geometry.coordinates[1], eMarker.geometry.coordinates[0]], {
        fillColor: assignColor(eMarker.properties.mag),
        radius:  markerSize(eMarker.properties.mag),
        fillOpacity: .85,
        color: assignColor(eMarker.properties.mag),
      });
    }

    // Create another function that will produce a popup after clicking on a marker
    function earthquakePopup(eMarker, overlay) {
      overlay.bindPopup("<h1>" + eMarker.properties.place + "</p><hr><h1>Magnitude: " + eMarker.properties.mag + "</h1>" + "</h3>"+"@ " + new Date(eMarker.properties.time));
    }
      
    // Declare a new variable and assign it the value if the data from the api call
    // Use geoJSON to attach the information to proper coordinates of the map
    let quakes = L.geoJSON(API_Data, {
      onEachFeature: earthquakePopup,
      pointToLayer: earthquakeMarker
    });

    // Establish a new function and insert the value of the quakes variable into it.
    produceMap(quakes);
  }

  // Establish attributes and characteristics of new function. Essentially, produce the three types of maps. 
  function produceMap(quakes) {
    // Create a variable called satellite and assign it the url for the satellite tileLayer
    let satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoic3dhdGlzd2FpbiIsImEiOiJja2MyazQycHYwNTB0MnJwN3g1cm1nbTRuIn0.h2RgwhpeJ_l1RFYM8X0bJQ");
    // Create a variable called grayscale and assign it the url for the grayscale (dark) tileLayer
    let grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoic3dhdGlzd2FpbiIsImEiOiJja2MyazQycHYwNTB0MnJwN3g1cm1nbTRuIn0.h2RgwhpeJ_l1RFYM8X0bJQ");
    // Create a variable called outdoor and assign it the url for the outdoor tileLayer
    let outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1Ijoic3dhdGlzd2FpbiIsImEiOiJja2MyazQycHYwNTB0MnJwN3g1cm1nbTRuIn0.h2RgwhpeJ_l1RFYM8X0bJQ");
      
    // Declare a new variable and assign it the value of an object holding an array of dictionaries.
    // Make the key the a string and the value the variable that holds the respective map
    let threeMaps = {
      "Satellite": satellite,
      "Grayscale": grayscale,
      "Outdoors": outdoor,
    };

    // Declare a new variable and assign it the value of an object holding one dictionary.
    // Make the key a string and make the value the quakes variable with all it's relevant data pertainging to markers and popups.
    let earthquakeMaps = {
      "Earthquakes": quakes
    };

    // Delcare a new variable and assign it the desired attributes for the initial map that appears after loading the index
    let defaultMap = L.map("map", {
      // Make center the geographical center of the 48
      center: [39.8283, -98.5795],
      // Turn on the scrollWheelZoom for easy scrolling with a mouse 
      scrollWheelZoom: true,
      zoom: 3.25,
      // Make outdoor map the default map and apply the data from the quakes variable
      layers: [outdoor,quakes],
    });


    // Create an additional layer that has the three strings tied to the three different types of maps 
    L.control.layers(threeMaps, earthquakeMaps, {
      collapsed: true
    // Append it to the index map
    }).addTo(defaultMap);

    // Declare a new variable and assign it all the information necessary for creating a legend
    let magnitudeLegend = L.control({position: 'bottomright'});
    magnitudeLegend.onAdd = function(defaultMap) {
      let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + assignColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };
    // Append legend to map on on index
    magnitudeLegend.addTo(defaultMap);

  }
}

// Assign the various magnitudes unique colors
function assignColor(magnitudes) {
  return magnitudes > 5 ? "DarkRed":
    magnitudes > 4 ? "Red":
    magnitudes > 3 ? "DarkOrange":
    magnitudes > 2 ? "Orange":
    magnitudes > 1 ? "YellowGreen":
    // <= 1 
    "Yellow"; 
}

// Use funtion to blow up marker sizes accordingly
function markerSize(magnitudes) {
  return magnitudes * 5;
}