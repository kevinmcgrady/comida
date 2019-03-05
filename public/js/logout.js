// get the logout button.
const button = document.getElementById('logout');

// when the logout button is clicked.
button.addEventListener("click", (e) => {
    // prevent default actions.
    e.preventDefault();
    // sign the user out.
    firebase.auth().signOut()
        .then((result) => {
            // if the user was signed out.
            return fetch('/logout', {
                method: "POST"
            })
            .then((result) => {
                // redirect the user to the login page.
                window.location.assign("/login");
            })
        })
        .catch((error) => {
            console.log(error);
        });
})