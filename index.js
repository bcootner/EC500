'use stric';

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var pgp = require('pg-promise')();
var randStr = require("randomstring");
var app = express();
var port = process.env.PORT || 8080;

var db = pgp('postgres://djlciyuhmnrckz:863b9dcbf6f076e322b38b2e2e62812b5ca32f301205941fb0c2b8725cf1cf9d@ec2-54-235-72-121.compute-1.amazonaws.com:5432/ddv40oul581abb');

//Tells express to look in the public folder for the assets 
app.use(express.static(__dirname + '/public'));

//Initialize the session
app.use(session({secret: 'sshh'}));

var sess;
app.get('/',function(req,res){
sess = req.session;
//Session set when user Request our app via URL
if(sess.email) {
/*
* This line check Session existence.
* If it existed will do some action.
*/
    res.redirect('/admin');
}
else {
    res.render('index.html');
}
});

//Use pug for templated pages
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true}));

//Search database for matching params - email and password 
app.post('/login', function(req,res){
	console.log("login attempt");
	sess = req.session;
	db.one('SELECT * FROM users WHERE email_address=$1 AND password=$2', [req.body.email, req.body.password])
	.then(function(data){
		//email and password are correct 
		console.log("log in found user: " + data["first_name"])
		res.render('profile', { data: data });
		//res.sendFile(path.join(__dirname, '/public/profile.html'));
		sess.email=req.body.email;
		res.end('done');
	})
	.catch(function(error){
		//email and password are wrong  
		console.log("error", error);
		res.sendFile(path.join(__dirname, '/public/InvalidLogin.html'));
	})

});

app.get('/admin',function(req,res){
  sess = req.session;
if(sess.email) {
res.write('<h1>Hello '+sess.email+'</h1>');
res.end('<a href="+">Logout</a>');
} else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href="+">Login</a>');
}
});

//Adds new sign up - firstName, lastName, password, confirmPassword, email  
app.post('/signup', function(req,res){
	console.log("sign up attempt");
	db.one('SELECT * FROM users WHERE email_address=$1', [req.body.email])
	.then(function(data){
		//email is alreay in db
		console.log("sign up found user " + data)
		res.sendFile(path.join(__dirname, '/public/test_signup.html'));

	})
	.catch(function(error){
		//Email not found 
		console.log("not found: ", error);
		if(req.body.password != req.body.confirmPassword) {
			console.log("Passwords do not match!");
			res.sendFile(path.join(__dirname, '/public/test.html'));
		} else if (req.body.password.length < 1) {
			console.log("Password must contain at least 1 characters!");
			res.sendFile(path.join(__dirname, '/public/test.html'));
		} else if (req.body.email.indexOf('@') == -1) {
			console.log("Email address is not valid!");
			res.sendFile(path.join(__dirname, '/public/test.html'));
		} else if (req.body.email.indexOf(' ') > -1) {
			console.log("Email address cannot contain spaces");
			res.sendFile(path.join(__dirname, '/public/test.html'));
		} else {
			//Ok to sign up user 
			var date = new Date()
			db.none('INSERT INTO users (first_name, last_name, email_address, password, signup_date, id_num, background_color, exp_pts) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [req.body.firstName, req.body.lastName, req.body.email, req.body.password, date, randStr.generate(10), '#ff0000', 5]);
			console.log("made user!")
			res.sendFile(path.join(__dirname, '/public/test_login.html'));
		}
	})

});

//Add pts 
app.post('/addPts', function(req,res){
	console.log("add pts attempt up");
	var newPts = 0 
	var feature_id = ""

	if (req.body.value == "scylla") {
		newPts += -6
		feature_id = "0000000000"
	} 
	if (req.body.value == "2") {
		newPts += 5
		feature_id = "1111111111"
	} 
	else if (req.body.value == "serge") {
		newPts += 5
		feature_id = "2222222222"

	} 
	else if (req.body.value == "alshaykh") {
		newPts += 5
		feature_id = "3333333333"
	} 
	else if (req.body.value == "penny") {
		newPts += 5
		feature_id = "4444444444"

	} 
	else if (req.body.value == "bookkeeper") {
		newPts += 10
		feature_id = "5555555555"
	} 
	else if (req.body.value == "#ff0000") {
		newPts += 15
		feature_id = "666666666"

	} 
	else if (req.body.value == "chuck") {
		newPts += 15
		feature_id = "777777777"
	} 

	if (newPts != 0) {
		db.one('SELECT * FROM users WHERE email_address=$1', [req.body.email])
		.then(function(data){
			//email is found
			console.log("found user")
			var pts = Number(data["exp_pts"])
			//check if user added this feature before 
			db.one('SELECT * FROM featurestransactions WHERE user_id=$1 AND feature_id=$2', [data["id_num"], feature_id])
			.then(function(data){
				//feature already added by user
				console.log("already added by usr") 
				res.sendFile(path.join(__dirname, '/public/alreadyAdded.html'));
			})
			.catch(function(error){
				//feature not added by user 
				console.log("not yet by usr - adding in feature transaction") 
				var date = new Date()
				db.none('INSERT INTO featurestransactions (user_id, feature_id, added_date) VALUES ($1,$2,$3)', [data["id_num"], feature_id, date]);
				//keep going - add pts
				db.none("UPDATE users SET exp_pts = $1 WHERE id_num = $2", [pts + newPts, data["id_num"] ])
				.then(function(data2){
					//updated pts!
					console.log("ADDED PTS to " + data["email_address"] + "for " + req.body.value)
					res.sendFile(path.join(__dirname, '/public/addedPts.html'));
				})
				.catch(function(error){
					//error adding pts
					console.log("error adding pts", error);
					res.sendFile(path.join(__dirname, '/public/addPts.html'));

				})
			})
		})
		.catch(function(error){
			//email and password are wrong  
			res.sendFile(path.join(__dirname, '/public/addPts.html'));

		})
	} else {
		console.log("not valid input");
		res.sendFile(path.join(__dirname, '/public/addPts.html'));
	}
});



//Main page
app.get('/',function(req,res){
	console.log("homepage hit");
	res.sendFile(path.join(__dirname, '/public/test_signup.html'));
});

// /profile/name directory  - using pug
app.get('/profile/:name',function(req,res){
	console.log("profile page");
	res.sendFile(path.join(__dirname, '/public/profile.html'));
	//console.log(req.params.name);
	//res.render('profile', { name: req.params.name });
});

app.get('/*',function(req,res){
	res.sendFile(path.join(__dirname, '/public/errorPage.html'));
});


//Not sure what this does, something with sockets...maybe for live-time refreshing?
app.listen(port, function() {
	console.log("scarletfish is listening on port: " + port);
})