
function updateFeatures() {
	var first = "wow" //data.first_name;
	var last = "test" //data.last_name;
	//var img = "img(src=\"profile-42914_960_720.jpg\" style=\"width: 200px; padding-right: 10px\"";

	var header = /*img + */first + " " + last + "WOOOOO";
    document.getElementById("features").innerHTML = "You can post!";
    document.getElementById("name").innerHTML = header;
}