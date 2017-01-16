var map = L.map('map').setView([35.0853, -106.6056], 12.5);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYWJxIiwiYSI6ImNpeHRxc3Y1MjAwNTQycW56d3NsMmNwYXkifQ.S9tHYTJkndcIGC5RWh_7Hw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);


var gridData;
//var grid = new L.geoJson("", { onEachFeature: onEachFeature });

function onEachFeature(feature, layer) {
    layer.on('click', function(e) {
        var coordsArr = getMinMax(e.target.feature.geometry);
        addBboxCoords(coordsArr);
        console.log(e.target.feature.geometry);
    });

}

L.TopoJSON = L.GeoJSON.extend({
    addData: function(jsonData) {
        if (jsonData.type === "Topology") {
            for (key in jsonData.objects) {
                geojson = topojson.feature(jsonData, jsonData.objects[key]);
                gridData = geojson;
                L.GeoJSON.prototype.addData.call(this, geojson);
            }
        } else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
        }
    }
});



var grid = new L.TopoJSON("", { onEachFeature: onEachFeature });
$.getJSON('grid.json')
    .done(addTopoData);

function addTopoData(topoData) {
    grid.addData(topoData);
    grid.addTo(map);
}

grid.addTo(map);
grid.setStyle({ 'className': 'grid-cell' });
/*
$.ajax({
    dataType: "json",
    url: "grid.json",
    success: function(data) {
        gridData = data;
        $(data.features).each(function(key, data) {
            geojson = topojson.feature(data, data.objects[key]);
            console.log(geojson);
            grid.addData.call(this, geojson);
        });
    }
}).error(function() {});
*/
$("#randBtn").click(function() {
    return pickRandom();
});


function addBboxCoords(coordArr) {
    $("input[name='min-lat']").attr("disabled", false);
    $("input[name='max-lat']").attr("disabled", false);
    $("input[name='min-lon']").attr("disabled", false);
    $("input[name='max-lon']").attr("disabled", false);
    $("input[name='min-lon']").val(coordArr[0]);
    $("input[name='max-lon']").val(coordArr[1]);
    $("input[name='min-lat']").val(coordArr[2]);
    $("input[name='max-lat']").val(coordArr[3]);
    centerMap(coordArr);

}


function centerMap(coordArr) {
    var xMid = (coordArr[0] + coordArr[1]) / 2,
        yMid = (coordArr[2] + coordArr[3]) / 2;
    map.setView([yMid, xMid], 18);
}

function pickRandom() {
    var num = Math.floor(Math.random() * 11592) + 1;

    randomFeature = gridData.features[num];
    console.log(gridData.features[num]);
    coordArr = getMinMax(randomFeature.geometry);
    centerMap(coordArr);
    //map.panTo(new L.LatLng(yMid, xMid));
    addBboxCoords(coordArr);
}

function getMinMax(geometry) {
    var xMin = geometry.coordinates[0][0][0],
        xMax = geometry.coordinates[0][2][0],
        yMin = geometry.coordinates[0][0][1],
        yMax = geometry.coordinates[0][2][1];
    return [xMin, xMax, yMin, yMax];
}