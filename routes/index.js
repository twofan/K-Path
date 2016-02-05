var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/kpath', function(req, res, next) {
    var source = req.query['source'];
    var target = req.query['target'];
    var result = {};
    if (!source){
        var err = new Error();
        err.status = 400;
        next(err);
        return;
    }
    var pred=[];
    var dist = req.g.singleSourceDijkstra(source, target, pred);
    if (!dist[target]){
        var err = new Error();
        err.status = 401;
        next(err);
        return;
    }
    var path = req.g.pathFromPred(source, target, pred);

    result['shortestPath'] = path;
    res.send(result);


});

module.exports = router;
