 var API_KEY= APIKEY;
 const queryurl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 const tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

 d3.json(queryurl,function(data){
     createFeature(data.features);
    console.log(data.features);
});
// Color selection based on magnitude
function circleMag(mag) {
    // let color="#38d807";
     if (mag <= 1) {
        color = "#c5e874";
    }
    else if (mag>1 && mag <= 2) {
        color = "#dcbb39";
    }
    else if (mag>2 && mag <= 3) {
        color = "#eba611";
    }
    else if (mag>3 && mag <= 4) {
        color = "#da7509";
    }
    else if (mag >4 && mag <=5){
        color = "#de4b15";
    }
    else if (mag > 5) {
        color="#6f250a"
    }
    return color;
}; 
function createFeature(earthquakeData){
    // Creating Tooltips
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr>
        <h4>Magnitude: ${feature.properties.mag}</h4><hr>
        <h5>Date: ${new Date(feature.properties.time)}</h5>`);
      }
      function pointToLayer (feature, latlng) {
        return new L.circle(
            latlng, {
            radius: (feature.properties.mag * 20000),
            fillColor: circleMag(feature.properties.mag),
            color: "#000000",
            stroke: true,
            weight: 1,
            fillOpacity: 0.8
            }
        );
    }
      const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer:pointToLayer
      });
      createMap(earthquakes);    

    }


    function createMap(earthquakes) {

        // Define satelliteMap , darkmap layers and outdoorsMap
        const satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.satellite",
          accessToken: API_KEY
        });
      
        const darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.dark",
          accessToken: API_KEY
        });
        const outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token={accessToken}", {
            maxZoom: 18,
            id: "mapbox.outdoors",
            accessToken: API_KEY
        });
      
        // Define a baseMaps object to hold our base layers
        const baseMaps = {
            "Satellite Map": satelliteMap,
            "Grayscale": darkMap,
            "Outdoors": outdoorsMap
        };
             // Creat a layer for the tectonic plates
  let tectonicPlates = new L.LayerGroup();

  // Create overlay object to hold our overlay layer
  const overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
  };
        // Create our map, giving it the satellitemap and earthquakes layers to display on load
        const myMap = L.map("mymap", {
          center: [
            37.09, -95.71
          ],
          zoom: 5,
          layers: [satelliteMap, earthquakes,tectonicPlates]
        });
        d3.json(tectonicPlatesURL, function(tectonicData) {
            L.geoJson(tectonicData, {
              color: "orange",
              weight: 3
            }).addTo(tectonicPlates);
          });
      
        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);
        // Set up the legend
    let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let level = [0, 1, 2, 3, 4, 5]

        for (let i = 0, ii = level.length; i < ii; i++) {
            console.log(circleMag(level[i] + 1));
            div.innerHTML += 
                '<i style="background:' + circleMag(level[i] + 1) + '"></i> ' + 
                + level[i] + (level[i + 1] ? ' - ' + level[i + 1] + '<br>' : ' + ');
        };
        return div;
    };
    
    // Adding legend to the map
    legend.addTo(myMap);
      }
      