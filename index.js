'use stric';

var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

//Tells express to look in the public folder for the assets 
app.use(express.static(__dirname + '/public'));

//Use pug for templated pages
app.set('view engine', 'pug')


//Main page
app.get('/',function(req,res){
	console.log("homepage hit");
	res.sendFile(path.join(__dirname, '/public/test.html'));
});

// /hidden directory 
app.get('/hidden',function(req,res){
	console.log("hidden found");
});

// /profile/name directory  - using pug
app.get('/profile/:name',function(req,res){
	console.log(req.params.name);
	res.render('profile', { name: req.params.name, message: 'Hello there!' });
});


//Not sure what this does, something with sockets...maybe for live-time refreshing?
app.listen(port, function() {
	console.log("scarletfish is listening on port: " + port);
})