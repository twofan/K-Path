/**
 * Created by twofan on 2/4/16.
 */
$( document ).ready(function(){

    var map = new GMaps({
        el: '#map',
        zoom: 7,
        lat: 36.8,
        lng: -120.0
    });

    $('#random-query').click(function(){
        var query = getRandomQuery();
        $.get( query, function( data ) {
            displayResult(map, data);
        });
    });

});

function getRandomQuery(count){
    if (!count){
        count=1890815;
    }
    var source = Math.floor(Math.random() * count) + 1;
    var target = Math.floor(Math.random() * count) + 1;
    return "/api/kpath?source="+source.toString()+"&target="+target.toString();
}

function displayResult(map, result){
    map.removePolylines();
    map.removeMarkers();
    var shortestPath = result['shortestPath'];
    drawPath(map, shortestPath);
}

function drawPath(map, path){
    var firstItem = path[0];
    var lastItem = path[path.length-1];
    map.addMarker({
        lat: firstItem['loc'][1]/1000000.0,
        lng: firstItem['loc'][0]/1000000.0
    });
    map.addMarker({
        lat: lastItem['loc'][1]/1000000.0,
        lng: lastItem['loc'][0]/1000000.0
    });

    var p = [];
    for (var i=0; i<path.length; i++){
        var item = path[i];
        var loc = [item['loc'][1]/1000000.0, item['loc'][0]/1000000.0];
        p.push(loc);
    }
    map.drawPolyline({
        path: p,
        strokeColor: '#131540',
        strokeOpacity: 0.6,
        strokeWeight: 6
    });
}