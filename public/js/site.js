/**
 * Created by twofan on 2/4/16.
 */
$( document ).ready(function(){

    var map = new GMaps({
        el: '#map',
        zoom: 11,
        lat: 33.98,
        lng: -118.1
    });

    $('#random-query').click(function(){
        var query = getRandomQuery();
        $.get( query, function( data ) {
            displayResult(map, data);
        });
    });

});

function getRandomQuery(count){

    return "/api/kpath";
}

function displayResult(map, result){
    map.removePolylines();
    map.removeMarkers();
    var shortestPath = result['shortestPath']['path'];
    var bdPath = result['bdPath']['path'];
    drawPath(map, shortestPath, '#FF0000');
    drawPath(map, bdPath, '#00FF00');
    $('#min-length').html(result['shortestPath']['length']);
    $('#alt-length').html(result['bdPath']['length']);
}

function drawPath(map, path, color){
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
        strokeColor: color,
        strokeOpacity: 0.6,
        strokeWeight: 6
    });
}