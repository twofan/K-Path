var algorithms = {};
var Queue = require('js-priority-queue');
algorithms.singleSourceDijkstra = function(g, source, target, pred, cutoff){
    // returns dist, path can be traced by pred
    var dist = {};  // dictionary of final distances
    var queue = new Queue({ comparator: function(a, b) { return a[1]-b[1]; }});
    var seen = {};
    seen[source]=1;
    queue.queue([source, 0]);
    var current;
    if (cutoff){
        if (cutoff <1){
            cutoff = 1;
        }
    }
    while (current = queue.dequeue()){
        var v = current[0];
        var d = current[1];
        if (cutoff && dist[target] && dist[target]*cutoff >d){
            break;
        }
        if (dist[v]){
            continue;
        }
        dist[v] = d;
        if (v==target && !cutoff){
            console.log("target reached");
            break;
        }
        for (var u in g.links[v]){
            var cost = g.links[v][u];
            var vu_dist = dist[v] + cost;
            if (!seen[u] || vu_dist < seen[u]){
                seen[u] = vu_dist;
                queue.queue([u, vu_dist]);

                if (pred){
                    pred[u] = [v];
                }
            }else if (seen[u] == vu_dist){
                if (pred){
                    pred[u].push(v);
                }
            }
        }

    }
    return dist;
}

algorithms.BD = function(g, source, target, cutoff){
    console.log("Running DB Algorithm from source "+source.toString()+" to target "+target.toString());
    var pred1 = [];
    var pred2 = [];
    var dist = algorithms.singleSourceDijkstra(g, source, target, pred1, cutoff);
    var dist2 = algorithms.singleSourceDijkstra(g, target, source, pred2, cutoff);
    console.log("Generate shortest path tree done!");
    var path1 = pathFromPred(g, source, target, pred1);
    var path2 = pathFromPred(g, target, source, pred2);
    var matrix1 = sharingMatrix(g, source, target, path1, cutoff);
    var matrix2 = sharingMatrix(g, target, source, path2, cutoff);
    console.log("Generate sharing matrix done!");
    var nodes = g.nodes;
    var count=0;

    var sharings = [0.1,0.25,0.5];
    var BDPaths = [];
    for (var i=0; i<sharings.length; i++){
        var sharing = sharings[i];
        var minNode = null;
        var minLen = null;
        for (var node in nodes){
            if (path1[node]){
                continue;
            }
            if (!dist[node] || !dist2[node]){
                continue;
            }
            if (checkViaPathSharing(g, source, target, node, matrix1, matrix2, dist[target], sharing)){
                count += 1;
                var len = dist[node]+dist2[node];
                if (!minLen || len < minLen){
                    minLen = len;
                    minNode = node;
                }
            }
        }
        BDPaths.push(minNode)
    }



    console.log(BDPaths);
    var ret = {
        'shortestPath':{
            'path':path1,
            'length':dist[target]
        },
        'AltPaths':[]
    };
    for (var i=0; i<sharings.length; i++){
        if (BDPaths[i]){
            ret['AltPaths'].push({
                'path':pathFromViaNode(g, source, target, BDPaths[i], pred1, pred2),
                'length':dist[BDPaths[i]]+dist2[BDPaths[i]]
            });
        }

    }

    return ret;

}

algorithms.plateau = function(g, source, target, cutoff){
    console.log("Running Plateau Algorithm from source "+source.toString()+" to target "+target.toString());

    var pred1 = {};
    var pred2 = {};
    var dist = algorithms.singleSourceDijkstra(g, source, target, pred1, cutoff);
    var dist2 = algorithms.singleSourceDijkstra(g, target, source, pred2, cutoff);
    console.log("Generate shortest path tree done!");
    var dict = {};
    var sharedLinkCount=0;
    var allLinkCount=0;
    for (var key in pred1) {
        allLinkCount+=1;
        var nodeID2 = pred1[key][0];
        var nodeID1 = key;
        if (pred2[nodeID1] && pred2[nodeID1][0] == nodeID2 || pred2[nodeID2] && pred2[nodeID2][0] == nodeID1) {
            sharedLinkCount+=1;
            if (!dict[nodeID1]){
                dict[nodeID1] = [nodeID2];
            }else{
                dict[nodeID1].append(nodeID2);
            }
        }
    }
    console.log("all link count "+allLinkCount.toString());
    console.log("shared link count "+sharedLinkCount.toString());
    var shortestPath = pathFromPred(g, source, target, pred1);
    var ret = {
        'shortestPath':{
            'path':shortestPath,
            'length':dist[target]
        },
        'AltPaths':[],
        'Overlapping':[]
    };
    var nodes = g.nodes;
    for (var key in dict){
        var row = dict[key];
        for (var i=0; i<row.length; i++){
            var nodeID1 = key;
            var nodeID2 = row[i];
            ret['Overlapping'].push([
                {
                    'id': parseInt(nodeID1),
                    'loc': nodes[nodeID1]['loc']
                },
                {
                    'id': parseInt(nodeID2),
                    'loc': nodes[nodeID2]['loc']
                }
            ]);

        }
    }

    return ret;


}



function checkViaPathSharing(g, source, target, p, matrix1, matrix2, dist, partial, log){
    if (!partial){ partial = 0.3 }
    var sharing = (matrix1[p]+matrix2[p])/dist;
    if (log){

        console.log("node: "+ p.toString()+"\tsharing from source: "+matrix1[p].toString() +"\tsharing from target: "+matrix2[p].toString()+"\t sharing: "+sharing.toString());
    }
    if (matrix1[p] == null || matrix2[p] == null || sharing> partial){
        return false;
    }else{
        return true;
    }

}

function pathFromViaNode(g, source, target, p, pred1, pred2){
    var path1 = pathFromPred(g, source, p, pred1);
    var path2 = pathFromPred(g, target, p, pred2);
    for (var i=path2.length-2; i>=0; i--){
        path1.push(path2[i]);
    }
    return path1;
}

function sharingMatrix(g, source, target, path, cutoff){

    var dist = {};  // dictionary of final distances
    var queue = new Queue({ comparator: function(a, b) { return a[1]-b[1]; }});
    var pred = [];
    var seen = {};
    seen[source]=0;
    var matrix = {};
    matrix[source]=1;
    queue.queue([source, 0]);
    var current;
    if (cutoff){
        if (cutoff <1){
            cutoff = 1;
        }
    }
    var pathDic = {};
    for (var i=0; i<path.length; i++){
        var nodeId = path[i]['id'];
        pathDic[nodeId] = true;
    }

    while (current = queue.dequeue()){
        var v = current[0];
        var d = current[1];
        if (cutoff && dist[target] && dist[target]*cutoff >d){
            break;
        }
        if (dist[v]){
            continue;
        }
        dist[v] = d;
        if (v==target && !cutoff){
            console.log("target reached");
            break;
        }
        if (pred[v]){
            var prev = pred[v][0];
            if (pathDic[v]){
                // current node in shortest path
                matrix[v] = matrix[prev] + g.links[prev][v];
            }else{
                matrix[v] = matrix[prev];
            }
        }
        if (v==target && !cutoff){
            break;
        }
        for (var u in g.links[v]){
            var cost = g.links[v][u];
            var vu_dist = dist[v] + cost;
            if (!seen[u] || vu_dist < seen[u]){
                seen[u] = vu_dist;
                queue.queue([u, vu_dist]);

                if (pred){
                    pred[u] = [v];
                }
            }else if (seen[u] == vu_dist){
                if (pred){
                    pred[u].push(v);
                }
            }
        }

    }
    return matrix;
}

algorithms.pathFromPred = pathFromPred;


function pathFromPred(g, source, target, pred){

    var nodes = g.nodes;
    var path = [];
    var current = target;

    while (current != source){
        var data = {
            'id': parseInt(current),
            'loc': nodes[current]['loc']
        }
        path.unshift(data);
        current = pred[current][0];
    }
    var data = {
        'id': parseInt(current),
        'loc': nodes[current]['loc']
    }
    path.unshift(data);
    return path;
}


module.exports = algorithms;