

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
            'https://barb-store.onrender.com/login', {
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


