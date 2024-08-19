



document.addEventListener('DOMContentLoaded', async function(){
    console.log('DOM fully loaded');
    const joinLink = document.getElementById('joinLink');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');

    console.log('Fetching auth status...');

   try {
    //fetch authentication tatus from the backend
    const response = await fetch('http://localhost:5000/auth-status', {
        method: 'GET',
        credentials: 'include', //Ensures cookies are sent with request

    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

    }

    const data = await response.json();

    console.log('Auth status received:', data);

    if (data.authenticated) {
        //user authenticated
        joinLink.style.display = 'none';
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';

        //logout function
        logoutLink.addEventListener('click', async function() {
            await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include'
            });
            window.location.reload(); // Refresh to update navbar
    });

   } else {

    //user is not authenticated
    joinLink.style.display = 'inline';
    loginLink.style.display = 'inline';
    logoutLink.style.display = 'none';
   }
} catch (error) {
    console.error('Error checking auth status', error);
        // Default to showing login/join if there's an error
        joinLink.style.display = 'inline';
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
}
});


