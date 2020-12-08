/// Application to visualize earthquake (last 7 days) as a layers on a earth map ///

// API URLs to get earthquakes data and tectonic plates boundaries.
var link1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var link2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// var link2 = 'static/data/PB2002_plates.json'

// GET request to get data from the URLs
const earthquake = d3.json(link1, function (earthquakeData) {
    d3.json(link2, function (tectonicData) {
        createFeatures(earthquakeData.features, tectonicData.features);
    })
})

function createFeatures(earthquakeDataFeatures, tectonicDataFeatures) {
    function eqLabels(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + Date(feature.properties.time) + "</p><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");
    }
    function tecLables(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.Name + "</h3><h4> PlateA: " + feature.properties.PlateA + "<br>PlateB:" + feature.properties.PlateB + "</h4> <hr><p>" + feature.properties.Source + "</p>");
    }
    var color = "";
    var earthquakes = L.geoJSON(earthquakeDataFeatures, {
        pointToLayer: function (feature, latlng) {

            if (feature.properties.mag > 5) {
                color = "#cc0000";
            } else if (feature.properties.mag > 4) {
                color = "#cc6600";
            } else if (feature.properties.mag > 3) {
                color = "#ff8000";
            } else if (feature.properties.mag > 2) {
                color = "#ffff33";
            } else if (feature.properties.mag > 1) {
                color = "#ffff66";
            } else if (feature.properties.mag < 1) {
                color = "#b2ff66";
            }
            radius = feature.properties.mag * 20000;

            return L.circle(latlng, { radius: radius, color: color, fillOpacity: 0.75, fillcolor: color })
        }, onEachFeature: eqLabels
    });
    var tectonics = L.geoJSON(tectonicDataFeatures, {
        style: function (feature) {
            return {
                color: "orange",
                weight: 2
            };
        },
        onEachFeature: tecLables
    });
    createMap(earthquakes, tectonics);
}

// Function to create a map and define map layers
function createMap(earthquakes, tectonics) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });
    var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v9",
        accessToken: API_KEY
    });

    // BaseMaps object for base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite Map": satmap,
        "Outdoors Map": outdoors
    };
    var overlayMaps = {
        Earthquakes: earthquakes,
        Tectonics: tectonics
    };

    // New map
    var myMap = L.map("map", {
        center: [
            30, 0
        ],
        zoom: 3,
        layers: [satmap, earthquakes, tectonics]
    });

    // Layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}