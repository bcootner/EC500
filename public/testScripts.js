
// if( screen.width <= 480 ) {
//     alert("FLAG:{'The verdict of a jury is the a priori opinion of that juror who smokes' - H. L. Mencken} ")
// }

// var attempt = 3; // A count for number of wrong password attempts

// function validate()
// {
//   var username = document.getElementById("username").value;
//   var password = document.getElementById("password").value;

//   if (username == "" || password == "")
//   {
//     alert("All fields are required");
//     document.getElementById("username").value = "";
//     document.getElementById("password").value = "";
//     return false;
//   }

//   var uname = "Inna";
//   if (username == uname && password == "1234")
//   {
//     alert("login successful");
//     window.location = "profile/" + uname;
//     return false;
//   }
//   else
//   {
//     attempt--;
//     alert("Wrong password. You have " + attempt + " attempts left.");

//     document.getElementById("username").value = "";
//     document.getElementById("password").value = "";
    
//     if (attempt == 0)
//     {
//       document.getElementById("username").disabled = true;
//       document.getElementById("password").disabled = true;
//       document.getElementById("submit").disabled = true;
//       return false;
//     }
//   }
// }

function openOption(evt, option) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(option).style.display = "block";
    evt.currentTarget.className += " active";
}


