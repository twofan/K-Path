var express = require('express');
var router = express.Router();
var LARegion = [[ -118599830,-118051235],[33805223, 34321512]]

/* GET home page. */
router.get('/kpath', function(req, res, next) {
    var source = req.query['source'];
    var target = req.query['target'];
    var result = {};
    if (!source || !target){
        req.g.setRegion(LARegion);
        source = req.g.getRandomNode();
        target = req.g.getRandomNode();
        console.log("random select node "+source.toString()+" and "+target.toString());
    }

    //var path = req.g.singleSourceDijkstraPath(source, target);
    //if (!path){
    //    var err = new Error("");
    //    err.status = 401;
    //    next(err);
    //    return;
    //}
    //result['shortestPath'] = path;
    var result = req.g.BD(source, target);
    res.send(result);


});

module.exports = router;
