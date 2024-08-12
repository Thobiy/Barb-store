
document.addEventListener('DOMContentLoaded', function(){
    const joinLink = document.getElementById('joinLink');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');

    function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const authToken = getCookie('authToken');

if (authToken) {
    joinLink.style.display = 'none';
    loginLink.style.display = 'none';
    logoutLink.style.display = 'inline';

    // Logout functionality
    logoutLink.addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin'
        }).then(() => {
            document.cookie = 'authToken=; Max-Age=0'; // Clear cookie
            window.location.reload(); // Refresh to update navbar
        });
    });
} else {
    joinLink.style.display = 'inline';
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
}
});



document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); //prevent default form submission

//collect form data
const username = document.getElementById('username').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

//create a user object

const userData = {
    username: username,
    email: email,
    password: password
};

try {
    //send post rerquest to backend

    const response = await fetch(
        'https://barb-store.onrender.com/register', {
            
        method: 'POST',
        headers: {
            'content-Type': 'application/json'

        },
        body:JSON.stringify(userData)
    });

    const result = await response.json();
    if (response.ok) {
        alert("Registeration Successful");

        document.getElementById('registerForm').reset();

        window.location.href = 'login.html';

    } else {
        alert("Registeration Failed: " + result.error);

    }

} catch (error) {
    console.error('Error:', error);
    alert('Error during registeration');
}

})


