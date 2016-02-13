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
    var colors = ['#0000FF','#FFFF00', '#00FFFF','#FF00FF'];
    map.removePolylines();
    map.removeMarkers();
    var shortestPath = result['shortestPath']['path'];
    var BDPaths = result['BDPaths'];
    for (var i=0; i<BDPaths.length; i++){
        if (i==0 || BDPaths[i]['length']!=BDPaths[i-1]['length']){
            drawPath(map, BDPaths[i]['path'], colors[i]);

        }
    }
    drawPath(map, shortestPath, '#FF0000');
    $('#min-length').html(result['shortestPath']['length']);
    $('#alt-length').html("");
    for (var i=0; i<BDPaths.length; i++) {
        if (i==0 || BDPaths[i]['length']!=BDPaths[i-1]['length']){
            $('#alt-length').append("<br />alt path "+(i+1).toString()+" length: "+BDPaths[i]['length']);

        }

    }

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
        strokeOpacity: 1,
        strokeWeight: 5
        
    });
}