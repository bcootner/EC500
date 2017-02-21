'use stric';

var express = require('express');
var path = require('path');
var pgp = require('pg-promise')();
var app = express();
var port = process.env.PORT || 8080;

var db = pgp('postgres://djlciyuhmnrckz:863b9dcbf6f076e322b38b2e2e62812b5ca32f301205941fb0c2b8725cf1cf9d@ec2-54-235-72-121.compute-1.amazonaws.com:5432/ddv40oul581abb');

//Tells express to look in the public folder for the assets 
app.use(express.static(__dirname + '/public'));

//Use pug for templated pages
app.set('view engine', 'pug')

//Search database for matching params 
app.get('/login/:email/:password', function(req,res){
	console.log("login page!")
	console.log(req.params.email);
	console.log(req.params.password);
	db.one('SELECT * FROM users WHERE email_address=$1 AND password=$2', req.params.email, req.params.password)
	.then(function(data){
		console.log("DATA:", data.value);
	})
	.catch(function(error){
		console.log("error", error);
	})
});


//Main page
app.get('/',function(req,res){
	console.log("homepage hit");
	res.sendFile(path.join(__dirname, '/public/test.html'));
});

// /hidden directory 
app.get('/flag',function(req,res){
	console.log("flag page found!");
	res.sendFile(path.join(__dirname, '/public/flag.html'));
});

app.get('/robots.txt',function(req,res){
	console.log("robots found!");
	res.sendFile(path.join(__dirname, '/public/robots.html'));
});

// /profile/name directory  - using pug
app.get('/profile/:name',function(req,res){
	console.log(req.params.name);
	res.render('profile', { name: req.params.name });
});


//Not sure what this does, something with sockets...maybe for live-time refreshing?
app.listen(port, function() {
	console.log("scarletfish is listening on port: " + port);
})