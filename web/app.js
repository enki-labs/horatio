#!/usr/bin/env node
'use strict';

var ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
    version: '2013.06.16',
    addHelp:true,
    description: 'Horatio app'
});

parser.addArgument(
    [ '-m', '--mongo'],
    { help: 'MongoDB host' }
);

parser.addArgument(
    [ '-mp', '--mongoport'],
    { help: 'MongoDB port' }
);

var args = parser.parseArgs();
var express = require('express');
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var main = require('./main');
var server = new mongodb.Server(args.mongo, args.mongoport, {});

// Routes

function verifyAuth (req, res, route)
{
    route();
    /*
    if (!req.headers['user-agent'].match(/Chrome/g))
    {
        res.redirect('/chrome');
    }
    else
    {
        if (!req.session || !req.session.user)
        {
            console.log('USER NOT AUTHD');
            res.redirect('/login');
        }
        else
        {
            route();
        }
    }*/
}

new mongodb.Db('horatio', server, {safe:true}).open(function (error, persist) {
    if (error) throw error;

    var app = module.exports = express();

    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.set('view options', {layout: false});
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(__dirname + '/static'));
        app.use(express.static(__dirname + '/bower_components'));
        app.use(express.static(__dirname + '/templates'));
    });

    /*var taskDb = new mongodb.Collection(persist, 'task');
    var logDb = new mongodb.Collection(persist, 'log');
    var nodeDb = new mongodb.Collection(persist, 'node');
    */
    
    app.get('/main', verifyAuth, main(server).index);
    //app.post('/task/find', verifyAuth, task(taskDb, logDb, nodeDb, zClient).find);
    //app.post('/task/detail', verifyAuth, task(taskDb, logDb, nodeDb, zClient).detail);
 
    // Server
    app.listen(4000, function(){
      console.log("express-bootstrap app running");
    });
});

