
/*
// Login Request Handling

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create a user object
    const loginData = {
        email: email,
        password: password
    };

    try {
        // Send POST request to backend
        const response = await fetch(
            //'https://barb-store.onrender.com/login', {
                'http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Login successful!');
            // Redirect to landing page
            window.location.href = 'index.html';
        } else {
            alert('failed to Login: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
});

*/

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-but');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent form submission

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'  // Include cookies in the request
            });

            const data = await response.json();

            if (response.ok && data.message === 'Login successful') {
                // Redirect to the homepage or dashboard after successful login
                window.location.href = '/index.html'; // Update this URL as needed
            } else {
                console.error('Login failed:', data.message);
                alert('Login failed: ' + data.message); // Display an error message
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.'); // Display a generic error message
        }
    });
});



