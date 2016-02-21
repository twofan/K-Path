var express = require('express');
var router = express.Router();
var LARegion = [[ -118599830,-118051235],[33805223, 34321512]]

/* BD Algorithm */
router.get('/kpath/bd', function(req, res, next) {
    var source = req.query['source'];
    var target = req.query['target'];
    var result = {};
    if (!source || !target){
        req.g.setRegion(LARegion);
        source = req.g.getRandomNode();
        target = req.g.getRandomNode();
        console.log("random select node "+source.toString()+" and "+target.toString());
    }


    var result = req.g.BD(source, target);
    res.send(result);


});

/* Plateau Algorithm */
router.get('/kpath/plateau', function(req, res, next) {
    var source = req.query['source'];
    var target = req.query['target'];
    var result = {};
    if (!source || !target){
        req.g.setRegion(LARegion);
        source = req.g.getRandomNode();
        target = req.g.getRandomNode();
        console.log("random select node "+source.toString()+" and "+target.toString());
    }


    var result = req.g.plateau(source, target);
    res.send(result);


});


module.exports = router;
