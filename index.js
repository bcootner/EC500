'use stric';

var express = require('express');
var app = express();
var path = require('path');

var port = process.env.PORT || 8080;

app.get('/',function(req,res){
	console.log("homepage hit");
	res.sendFile(path.join(__dirname, '/public/test.html'));
});

app.get('/hidden',function(req,res){
	console.log("hidden found");
});