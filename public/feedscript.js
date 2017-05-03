/*
make it pretty
only text based posts
*/
// external JS: masonry.pkgd.js
var $grid = $('.grid').masonry({
	itemSelector: '.grid-item',
	//columnWidth: 160
	columnWidth: '.grid-sizer',
	percentPosition: true
});

window.onload = function(){
	var all_posts = document.getElementsByClassName("post");
	var j = 0;
	for (var i = data.length - 1; i >= 0; i--) {
		if (j >= all_posts.length){
			break;
		}
		all_posts.item(j).innerHTML = data[i]['text'];
		all_posts.item(j).style.backgroundColor = data[i]['bg_color'];
		all_posts.item(j).style.fontFamily = data[i]['font'];
		all_posts.item(j).style.fontSize = data[i]['font_size'];
		all_posts.item(j).style.color = data[i]['font_color'];
		j++;
	}
	var my_posts = document.getElementsByClassName("grid-item-posts");
	var j = 0;
	for (var i = myPosts.length - 1; i >= 0; i--) {
		if (j >= my_posts.length){
			break;
		}
		my_posts.item(j).innerHTML = myPosts[i]['text'];
		my_posts.item(j).style.backgroundColor = myPosts[i]['bg_color'];
		my_posts.item(j).style.fontFamily = myPosts[i]['font'];
		my_posts.item(j).style.fontSize = myPosts[i]['font_size'];
		my_posts.item(j).style.color = myPosts[i]['font_color'];
		j++;
	}
	$grid.masonry()
}

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var content = document.getElementById('postContent');

$grid.on( 'click', '.post', function() {
	// change size of item via class
	$( this ).addClass('grid-item-others');

});

$grid.on( 'click', '.grid-item-profile', function() {
	window.location.href = "https://scarletfish.herokuapp.com"
});

$grid.on( 'click', '.grid-item-posts', function() {
	// change size of item via class
//  var elem = document.createElement("img");
//  elem.src = 'apoocher.jpg';
//  var text = document.createElement("p");
//redirect works
//	window.location.replace("https://scarletfish.herokuapp.com/login");
	document.getElementById('postContent').innerHTML = myPosts[0]['text'];
	modal.style.display = "block";
//  document.getElementById("postContent").appendChild("elem");
 // document.getElementById("myModal").appendChild("text");
//  text.innerHTML = text.innerHTML + 'Extra stuff';
  // trigger layout
});

/* For leading back to profile
$grid.on( 'click', '.grid-item', function() {
  // change size of item via class
  $( this ).toggleClass('grid-item-');
  // trigger layout
  $grid.masonry();
});*/

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}
