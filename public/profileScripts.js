
function updateFeatures() {
	var first = '#{data.first_name}';
	var last = '#{data.last_name}';
	//var img = "img(src=\"profile-42914_960_720.jpg\" style=\"width: 200px; padding-right: 10px\"";

	var header = /*img + */first + " " + last;
    document.getElementById("features").innerHTML = "You can post!";
    document.getElementById("name").innerHTML = header;
}