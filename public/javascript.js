
// if( screen.width <= 480 ) {
//     alert("FLAG:{'The verdict of a jury is the a priori opinion of that juror who smokes' - H. L. Mencken} ")
// }

var attempt = 3; // A count for number of wrong password attempts

function validate()
{
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var uname = "Inna";
	if (username == uname && password == "1234")
	{
		alert("login successful");
		window.location = "profile/" + uname;
		return false;
	}
	else
	{
		attempt--;
		alert("Wrong password. You have " + attempt + " attempts left.");

		document.getElementById("username").value = "";
		document.getElementById("password").value = "";
		
		if (attempt == 0)
		{
			document.getElementById("username").disabled = true;
			document.getElementById("password").disabled = true;
			document.getElementById("submit").disabled = true;
			return false;
		}
	}
}