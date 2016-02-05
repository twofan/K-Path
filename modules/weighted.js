var algorithms = {};
algorithms.singleSourceDijkstra = function(g, source, target, pred){
    // returns dist, path can be traced by pred

    var dist = {};  // dictionary of final distances
    var queue = [];
    var seen = {source:0};
    queue.push([source, 0]);
    var current;
    while (current = queue.shift()){
        var v = current[0];
        var d = current[1];
        if (dist[v]){
            continue;
        }
        dist[v] = d;
        if (v==target){
            break;
        }
        for (var u in g.links[v]){
            var cost = g.links[v][u];
            var vu_dist = dist[v] + cost;
            if (!seen[u] || vu_dist < seen[u]){
                seen[u] = vu_dist;
                queue.push([u, vu_dist]);
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

module.exports = algorithms;