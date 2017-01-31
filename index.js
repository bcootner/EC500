'use stric';

var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
	console.log("homepage hit");
	res.sendFile(path.join(__dirname, '/public/test.html'));
});

app.get('/hidden',function(req,res){
	console.log("hidden found");
});

app.listen(port, function() {
	console.log("scarletfish is listening on port" + port);
})