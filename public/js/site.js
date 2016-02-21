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

    $('#random-query-bd').click(function(){
        var query = getRandomQuery("bd");
        $.get( query, function( data ) {
            displayResult(map, data);
        });
    });
    $('#random-query-plateau').click(function(){
        var query = getRandomQuery("plateau");
        $.get( query, function( data ) {
            displayResult(map, data);
        });
    });

});

function getRandomQuery(algorithm){

    return "/api/kpath/"+algorithm;
}

function displayResult(map, result){
    var colors = ['#0000FF','#FFFF00', '#00FFFF','#FF00FF'];
    map.removePolylines();
    map.removeMarkers();
    var shortestPath = result['shortestPath']['path'];
    var AltPaths = result['AltPaths'];
    for (var i=0; i<AltPaths.length; i++){
        if (i==0 || AltPaths[i]['length']!=AltPaths[i-1]['length']){
            drawPath(map, AltPaths[i]['path'], colors[i]);

        }
    }
    drawPath(map, shortestPath, '#FF0000');
    $('#min-length').html(result['shortestPath']['length']);
    $('#alt-length').html("");
    for (var i=0; i<AltPaths.length; i++) {
        if (i==0 || AltPaths[i]['length']!=AltPaths[i-1]['length']){
            $('#alt-length').append("<br />alt path "+(i+1).toString()+" length: "+AltPaths[i]['length']);

        }

    }
    drawOverlapping(map, result['Overlapping'], '#000000');

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

function drawOverlapping(map, paths, color){
    for (var i=0; i<paths.length; i++){
        var path = paths[i];
        var loc1 = [path[0]['loc'][1]/1000000.0,path[0]['loc'][0]/1000000.0];
        var loc2 = [path[1]['loc'][1]/1000000.0,path[1]['loc'][0]/1000000.0];
        map.drawPolyline({
            path: [loc1, loc2],
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 1

        });
    }
}