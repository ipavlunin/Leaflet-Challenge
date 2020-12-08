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

