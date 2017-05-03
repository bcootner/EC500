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

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var content = document.getElementById('postContent');

$grid.on( 'click', '.post', function() {
	// change size of item via class
	$( this ).addClass('grid-item-others');
//  var elem = document.createElement("img");
//  elem.src = 'apoocher.jpg';
//  var text = document.createElement("p");
	window.location.replace("https://scarletfish.herokuapp.com/login");
	document.getElementById('postContent').innerHTML = '<img src="apoocher.jpg"/>';
	modal.style.display = "block";
//  document.getElementById("postContent").appendChild("elem");
 // document.getElementById("myModal").appendChild("text");
//  text.innerHTML = text.innerHTML + 'Extra stuff';
  // trigger layout
	$grid.masonry();
});

$grid.on( 'click', '.grid-item', function() {
	// change size of item via class
	$( this ).toggleClass('grid-item-');
	// trigger layout
	$grid.masonry();
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
