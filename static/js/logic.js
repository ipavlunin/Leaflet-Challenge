/// Application to visualize earthquake (last 7 days) as a layers on a earth map ///

// API URLs to get earthquakes data and tectonic plates boundaries.

var link1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var link2 = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json";

// GET request to get data from the URLs

const earthquake = d3.json(link1, function (earthquakeData) {
    d3.json(link2, function (tectonicData) {
        createFeatures(earthquakeData.features, tectonicData.features);
    })
})

// Function to create a map and define map layers

function createMap(earthquakes, tectonics) {

    var streetmap = L.layer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
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
}