$(document).ready(function() {
	var grid = $('.grid');

	grid.masonry({
		itemSelector: '.grid-item',
		columnWidth: 200
	},

	// Function called once the elements are retrieved
	function(new_elts) {
		var elts = $(new_elts).css('opacity', 0);

		elts.animate({opacity: 1});
		grid.masonry('appended', elts);
	});
});
