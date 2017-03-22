'use stric';

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var pgp = require('pg-promise')();
var app = express();
var port = process.env.PORT || 8080;

var db = pgp('postgres://djlciyuhmnrckz:863b9dcbf6f076e322b38b2e2e62812b5ca32f301205941fb0c2b8725cf1cf9d@ec2-54-235-72-121.compute-1.amazonaws.com:5432/ddv40oul581abb');

//Tells express to look in the public folder for the assets 
app.use(express.static(__dirname + '/public'));

//Use pug for templated pages
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true}));

//Search database for matching params - email and password 
app.post('/login', function(req,res){
	console.log("login attempted!");
	db.one('SELECT * FROM users WHERE email_address=$1 AND password=$2', [req.body.email, req.body.password])
	.then(function(data){
		//email and password are correct 
		console.log("log in found user: " + data["first_name"])
		res.render('profile', { data: data, name: data.first_name });
		//res.sendFile(path.join(__dirname, '/public/profile.html'));
	})
	.catch(function(error){
		//email and password are wrong  
		console.log("error", error);
		res.sendFile(path.join(__dirname, '/public/InvalidLogin.html'));
	})

});

//Adds new sign up - firstName, lastName, password, confirmPassword, email  
app.post('/signup', function(req,res){
	console.log("login attempted!");
	db.one('SELECT * FROM users WHERE email_address=$1', [req.body.email])
	.then(function(data){
		//email is alreay in db
		console.log("sign up fond user " + data)
		alert("This email address is already registered!");
	})
	.catch(function(error){
		//Email not found 
		console.log("not found: ", error);
		if(req.body.password != req.body.confirmPassword) {
			alert("Passwords do not match!");
		} else if (req.body.password.legnth < 8) {
			alert("Password must contain at least 8 characters!");
		} else if (req.body.email.indexOf('@') == -1) {
			alert("Email address is not valid!");
		} else if (req.body.email.indexOf(' ') > -1) {
			alert("Email address cannot contain spaces");
		} else {
			//Ok to sign up user 
			var date = new Date()
			db.none('INSERT INTO users (first_name, last_name, email_address, password, install_date) VALUES ($1,$2,$3,$4,$5)', [req.body.firstName, req.body.lastName, req.body.email, req.body.password, date]);
		}
	})

});


//Main page
app.get('/',function(req,res){
	console.log("homepage hit");
	res.sendFile(path.join(__dirname, '/public/test.html'));
});

// app.post('/login', function(req,res){
// 	console.log('login in GET')
// 	db.one('SELECT * FROM users WHERE email_address=$1 AND password=$2', [req.params.email, req.params.password])
// 	.then(function(data){
// 		//email and password are correct 
// 		res.sendFile(path.join(__dirname, '/public/profile.html'));
// 	})
// 	.catch(function(error){
// 		//email and password are wrong  
// 		console.log("error", error);
// 		res.sendFile(path.join(__dirname, '/public/InvalidLogin.html'));
// 	})
// })

app.get('/scrolling',function(req,res){
	console.log("homepage hit");
	res.sendFile(path.join(__dirname, '/public/Scrollspace/index.html'));
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
	console.log("profile page");
	res.sendFile(path.join(__dirname, '/public/profile.html'));
	//console.log(req.params.name);
	//res.render('profile', { name: req.params.name });
});

app.get('/*',function(req,res){
	console.log("flag page found!");
	res.sendFile(path.join(__dirname, '/public/errorPage.html'));
});


//Not sure what this does, something with sockets...maybe for live-time refreshing?
app.listen(port, function() {
	console.log("scarletfish is listening on port: " + port);
})