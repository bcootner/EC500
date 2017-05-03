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

var sess = {
  secret: 'keyboard cat',
  cookie: { maxAge: 300000 },
  proxy: true,
  resave: true,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy 
  sess.cookie.secure = true // serve secure cookies 
}
 
app.use(session(sess));



// Access the session as req.session 
app.get('/cookie', function(req, res, next) {
  var sess = req.session;
  if (sess.views) {
    sess.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + sess.views + '</p>');
    res.write('<p>session id: ' + sess.id + '</p>');
    res.write('<p>cookie: ' + sess.cookie.maxAge + '</p>');
    res.write('<p>userId: ' + sess.userId + '</p>');
    res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
    res.end();
  } else {
    sess.views = 1;
    res.end('welcome to the session demo. refresh!');
  }
});


//Tells express to look in the public folder for the assets 
app.use(express.static(__dirname + '/public'));

//Use pug for templated pages
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true}));

//log out function 
app.post('/logout', function(req,res){
	console.log("log out attempt");
	req.session.userId = null
	res.sendFile(path.join(__dirname, '/public/signup.html'));
});

//Search database for matching params - email and password 
app.post('/login', function(req,res){
	console.log("login attempt");
	db.one('SELECT * FROM users WHERE email_address=$1 AND password=$2', [req.body.email, req.body.password])
	.then(function(data){
		//email and password are correct 
		console.log("log in found user: " + data["first_name"]);
		req.session.userId = data["id_num"];
		res.render('profile', { data: data, error: "", message: "" });
	})
	.catch(function(error){
		//email and password are wrong  
		console.log("error", error);
		res.sendFile(path.join(__dirname, '/public/invalid.html'));
	})

});

//Adds new sign up - firstName, lastName, password, confirmPassword, email  
app.post('/signup', function(req,res){
	console.log("sign up attempt");
	db.one('SELECT * FROM users WHERE email_address=$1', [req.body.email])
	.then(function(data){
		//email is alreay in db
		console.log("sign up found user " + data)
		res.sendFile(path.join(__dirname, '/public/InvalidSignUps/emailinuse.html'));

	})
	.catch(function(error){
		//Email not found 
		console.log("not found: ", error);
		if(req.body.password != req.body.confirmPassword) {
			console.log("Passwords do not match!");
			res.sendFile(path.join(__dirname, '/public/InvalidSignUps/passwordsnotmatch.html'));
		} else if (req.body.password.length <= 6) {
			console.log("Password must contain  6 characters!");
			res.sendFile(path.join(__dirname, '/public/InvalidSignUps/passwordnotlong.html'));
		} else if (req.body.email.indexOf('@') == -1) {
			console.log("Email address is not valid!");
			res.sendFile(path.join(__dirname, '/public/InvalidSignUps/invalidemail.html'));
		} else if (req.body.email.indexOf(' ') > -1) {
			console.log("Email address cannot contain spaces");
			res.sendFile(path.join(__dirname, '/public/InvalidSignUps/invalidemail.html'));
		} else {
			//Ok to sign up user
			var date = new Date()
			var id = randStr.generate(10)
			db.none('INSERT INTO users (first_name, last_name, email_address, password, signup_date, id_num, background_color, exp_pts) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [req.body.firstName, req.body.lastName, req.body.email, req.body.password, date, id, '#ff0000', 5]);
			console.log("made user!")
			req.session.userId = id;
			//now log them in 
			var data = {"first_name": req.body.firstName, "last_name": req.body.lastName, "email_address": req.body.email, "signup_date": date, "background_color":"#ff0000", "exp_pts": 5}
			res.render('profile', { data: data, error: "", message: "" });
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
	var sess = req.session;
	if (sess.userId != null)
	{
		//log user in 
		db.one('SELECT * FROM users WHERE id_num=$1', [sess.userId])
			.then(function(data){
				req.session.userId = data["id_num"];
				res.render('profile', { data: data, error: "", message: "" });
			})
			.catch(function(error){
				//email and password are wrong  
				console.log("error", error);
				res.sendFile(path.join(__dirname, '/public/InvalidLogin.html'));
		})
	}
	else
	{
		res.sendFile(path.join(__dirname, '/public/signup.html'));
	}
});


//get all of the posts
app.get('/feed',function(req,res){
	console.log("feed hit");
	db.any("SELECT * from posts WHERE posted_by=$1 ORDER BY posted_date", [req.session.userId])
	.then(function(myPosts){
		//got your posts
		console.log("my posts" + myPosts)
		db.any("SELECT * from posts WHERE posted_by!=$1 ORDER BY posted_date", [req.session.userId])
		.then(function(otherPosts){
			//got all other posts
			console.log("my posts" + otherPosts)
			res.render('feed', { myPosts: myPosts, data: otherPosts});
		})
		.catch(function(error){
			//error adding pts
			console.log("error with other posts", error);

		})
	})
	.catch(function(error){
		//error adding pts
		console.log("error with your posts", error);

	})
});


//Change background color
app.post('/back_color', function(req,res){
	console.log("back_color attempt");
	console.log(req.body.text_color)
	var sess = req.session;
	db.none("UPDATE users SET background_color = $1 WHERE id_num = $2", [req.body.text_color, sess.userId])
	.then(function(data) {
		console.log("background color changed")
		var sess = req.session;
		if (sess.userId != null)
		{
			//log user in 
			db.one('SELECT * FROM users WHERE id_num=$1', [sess.userId])
				.then(function(data){
					req.session.userId = data["id_num"];
					res.render('profile', { data: data, error: "", message: "" });
				})
				.catch(function(error){
					//email and password are wrong  
					console.log("error", error);
					res.sendFile(path.join(__dirname, '/public/InvalidLogin.html'));
			})
		}
		else
		{
			res.sendFile(path.join(__dirname, '/public/signup.html'));
		}
	})
	.catch(function(error){
		console.log("error changing background color")
		console.log(error)
		res.error(error)
	})

});

//Add a post 
app.post('/post', function(req,res){
	console.log("post attempt");
	console.log(req.body)
	var sess = req.session;
	if (sess.userId != null)
	{
		//add a post
		var date = new Date()
		db.one('SELECT * FROM users WHERE id_num=$1', [sess.userId])
			.then(function(data){
				var pts = Number(data["exp_pts"])
				var newPts = pts + 10
				console.log(newPts)
				db.none("UPDATE users SET exp_pts = $1 WHERE id_num = $2", [newPts, sess.userId ])
				req.session.userId = data["id_num"];
				db.one('INSERT INTO posts (posted_by, text, font, bg_color, font_size, first_name, last_name, priority, likes, dislikes, posted_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [sess.userId, req.body.postEntry, req.body.font, req.body.bg_color, req.body.size, data["first_name"], data["last_name"], req.body.priority, 0, 0, date])
				.then(function(data2){
					res.render('profile', { data: data, error: "", message: "Post made!" });
				})
				.catch(function(error){
					console.log("error with insert", error)
					res.render('profile', { data: data, error: "Error with post", message: "" });

				})
			})
			.catch(function(error){
				//email and password are wrong  
				console.log("error", error);
				res.sendFile(path.join(__dirname, '/public/InvalidLogin.html'));
		})
	}
	else
	{
		res.sendFile(path.join(__dirname, '/public/signup.html'));
	}
});

app.get('/*',function(req,res){
	res.sendFile(path.join(__dirname, '/public/errorPage.html'));
});


//Not sure what this does, something with sockets...maybe for live-time refreshing?
app.listen(port, function() {
	console.log("scarletfish is listening on port: " + port);
})