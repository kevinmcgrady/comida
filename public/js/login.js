// front end validation for email and password
$(document).ready(function(){
    // get the login form
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const errorField = document.querySelector(".authError");

    // get the loading spinner.
    const spinner = document.getElementById("spinner");
    // validate the login form.
     $("#loginForm").validate({
        rules: {
            //email
            email:{
                required: true,
                email: true
            },
            password:{
                required: true
            }
        },
        //output messages
        messages:{
            email:{
                required: "Please enter an Email Address",
                email: "Please Enter a Valid Email Address e.g. example@example.com"
            },
            password:{
                required: "Please Enter a Password"
            }
        }
    })

    // when the form is submitted.
    form.addEventListener("submit", (e) => {
    // prevent default action.
   e.preventDefault();

   // if the form is valid.
   if($("#loginForm").valid()) {
    // start the spinner.
    spinner.style.display = "block";

    // sign the user in with the email and password.
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((result) => {
            // if the user was signed in correctly
            // get the JSON web token for the user.
            return firebase.auth().currentUser.getIdToken();
        })
        .then((token) => {
            return fetch('/login', {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ token: token })
            })
        })
        .then((result) => {
            // return the result as json data.
            return result.json();
        })
        .then((result) => {
            // stop the spinner.
            spinner.style.display = "none";
            // redirect the user.
            window.location.assign(result.url);
        })
        .catch((error) => {
            // stop the spinner.
            spinner.style.display = "none";
            // do something with the message.
            errorField.innerHTML = error.message;
        })
   } 
   
});
});

