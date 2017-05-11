# EC500: Life is a Game
This is our EC500 project: Life is a Game. It is a proof of concept of a social media site that aims to take the obsession with
social media posting with the addictiveness of games. The concept is simple: every action you make give you 
points. Points unlock features that you can show off to friends too show that you are truly better than them.
Achievements are available from the profile page to find hidden information which give large amounts of points.

The site is hosted at https://scarletfish.herokuapp.com. Check it out!

*Please visit the website only with https://. Cookies do not work properly with normal http.*

To register for an account, head over to the site and register for an account using an email. Then head over
to the login page. Once you log in, you can make posts from your profile page. Your posts will be shown around
the profile button in the center for a total of 8 posts shown at a time. Any posts made by anyone else will be
populated in the surrounding post boxes in chronological order. If a post is clicked, a display will pop up with
the full text of the post.

The site uses on node.js, express, the Masonry javascript grid library, and pug. It is hosted on a Postgress database.

### About:

index.js - This file contains all of the connections to our Postgresssql database. It takes care of the routes from our app and correctly navigate to where the user needs to go. It is written in node.js and uses the Express framework. 

public - This folder contains all of the html, css and javascript needed for our site. Some of the views include the login and sign up page, the achievement page and error pages telling you the page you entered is invalid. All of the request get sent to the backend via a POST command using an html form. 

views - This folder contains all of the views written in pug. Pug is similar to html, except it allows for dynamic templating and makes writing code easier. It also allowed us to type faster and it improves readability, which means maintainability and productivity. 


### Running Locally:

If you would like to run our project locally you can, but it won’t live up to it’s full potential. In order to do this first install the following node packages:

```
npm install body-parser
npm install express-session
npm install express
```

After doing that, clone this repo, change into that directory and run 
```
node index.js
```

This will open up localhost:8080 allowing you to run scarletfish locally. Unfortunately the database is not local, so those features will not work.



