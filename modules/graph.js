/**
 * Created by twofan on 2/4/16.
 *
 * Read map file and generate a basic map object that contains links and nodes
 */

var async = require('async');
var readline = require('readline');
var fs = require('fs');
var weighted = require('./weighted');
graph = function(nodeFile, linkFile){
    this.nodeFile = nodeFile;
    this.linkFile = linkFile;
    this.readFiles = readFiles;
    this.nodes = null;
    this.links = null;
    this.nodesInRegion = null;
    this.region = null;
    this.singleSourceDijkstra = function(source, target, pred){
        console.log(source.toString()+" "+target.toString());
        return weighted.singleSourceDijkstra(this, source, target, pred);
    }
    this.singleSourceDijkstraPath = function(source, target){
        console.log("Getting Path from "+source.toString()+" to "+target.toString());
        var pred = [];
        var cost = weighted.singleSourceDijkstra(this, source, target, pred);
        var path = weighted.pathFromPred(this, source, target, pred);
        return path;
    }
    this.BD = function(source, target){
        return weighted.BD(this, source, target);
    }
    this.plateau = function(source, target){
        return weighted.plateau(this, source, target);
    }
    this.getRandomNode = function(){
        return this.nodesInRegion[Math.floor(Math.random()*this.nodesInRegion.length)];
    }
    this.setRegion = function(region){
        if (region==this.region){
            return;
        }
        this.region = region;
        this.nodesInRegion = [];
        for (var k in this.nodes){
            var loc = this.nodes[k]['loc'];

            if (loc[0]>region[0][0] && loc[0]<region[0][1] && loc[1]>region[1][0] && loc[1]<region[1][1]){
                this.nodesInRegion.push(k);
            }
        }
    }
    this.pathFromPred = pathFromPred;
};

function readFiles(callback){
    const fs = require('fs');
    var nodeFile = this.nodeFile;
    var linkFile = this.linkFile;
    var nodes = {};
    var links = {};
    this.nodes = nodes;
    this.links = links;
    readNodeFile(nodeFile, nodes, function(){
        readLinkFile(linkFile, links, function(){
            callback();
        })
    })
}

function readNodeFile(nodeFile, nodes, callback){
    // read node file
    var count=0;
    const rl = readline.createInterface({
        input: fs.createReadStream(nodeFile),
        terminal: false
    });

    rl.on('line', function (line) {
        var arr = line.split(' ');
        if (arr[0] == 'v'){
            count+=1;
            var nodeId = parseInt(arr[1]);
            var loc = [parseInt(arr[2]), parseInt(arr[3])];
            nodes[nodeId] = {'loc':loc};
        }
    });

    rl.on('close', function(){
        console.log(count.toString()+" nodes read");
        callback();
    })
}

function readLinkFile(linkFile, links, callback){
    // read link file

    var count=0;
    const rl = readline.createInterface({
        input: fs.createReadStream(linkFile),
        terminal: false
    });

    rl.on('line', function (line) {
        var arr = line.split(' ');
        if (arr[0] == 'a'){
            count+=1;
            var fromNode = parseInt(arr[1]);
            var toNode = parseInt(arr[2]);
            var weight = parseInt(arr[3]);
            if (!links[fromNode]){
                links[fromNode] = {};
            }
            if (!links[toNode]){
                links[toNode] = {};
            }
            links[fromNode][toNode] = weight;
            links[toNode][fromNode] = weight;
        }
    });

    rl.on('close', function(){
        console.log(count.toString()+" links read");
        callback();
    })
}

function pathFromPred(source, target, pred){
    var nodes = this.nodes;
    var path = [];
    var current = target;

    while (current != source){
        var data = {
            'id': current,
            'loc': nodes[current]['loc']
        }
        path.unshift(data);
        current = pred[current][0];
    }
    var data = {
        'id': current,
        'loc': nodes[current]['loc']
    }
    path.unshift(data);
    return path;
}



module.exports = graph;