// front end form validation
$(document).ready(function(){
    // get the register form
    const form = document.getElementById('registerForm');

    // get the values of the form.
    const email = form.email;
    const password = form.password;
    const firstName = form.firstName;
    const lastName = form.lastName;
    const contactNumber = form.contactNumber;
    const errorField = document.querySelector(".authError");

// get the spinner.
const spinner = document.getElementById("spinner");
    // validate the register form.
    $("#registerForm").validate({
        rules:{
            // first name
            firstName:{
                required: true,
            },
            // last name
            lastName:{
                required: true,
            },
            // email address
            email:{
                required: true,
                email: true
            },
            // phone number
            contactNumber:{
                required: true,
                phoneUK: true
            },
            // password
            password:{
                required: true
            },
        },
        // error messages for form validation
        messages:{
            firstName:{
                required: "Please Enter Your First Name"
            },
            lastName:{
                required: "Please Enter Your Last Name"
            },
            email:{
                required: "we need your email address to contact you",
                email:"Please Enter a Valid Email Address e.g. example@example.com" 
            },
            contactNumber:{
                required:"Please Enter a UK Landline or Moible Number",
                phoneUK:"Your Phone Number Must Be a UK landline or mobile number"
            },
            password:{
                required: "Please Enter a Password"
            }
        }
    });

    // when the form is submitted.
form.addEventListener("submit", (e) => {
    // prevent default actions.
    e.preventDefault();
    // if the form is valid.
    if($("#registerForm").valid()) {
        // start the spinner.
    spinner.style.display = "block";

    // create a new user with with firebase.
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((user) => {
            // if the user was created.
            return fetch('/register', {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({id: user.user.uid, email: email.value, firstName: firstName.value, lastName: lastName.value, contactNumber: contactNumber.value})
            })
        })
        .then((result) => {
            // return the data as json.
            return result.json();
        })
        .then((result) => {
            // stop the spinner
            spinner.style.display = "none";
            // redirect the user to the login page.
            window.location.assign('/login');
        })
        .catch((error) => {
            // stop the spinner
            spinner.style.display = "none";
            // do something with the error message.
            errorField.innerHTML = error.message;
        })
    }
})
});

