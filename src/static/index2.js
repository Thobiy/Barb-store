

function getSessionToken() {
    return localStorage.getItem('auth_token');
  }


      // Update the navbar based on the session token
      function updateNavbar() {
        const sessionToken = getSessionToken();
        
        const loginLinkEl = document.getElementById('loginLink');
        const joinLinkEl = document.getElementById('joinLink');
        const logoutLinkEl = document.getElementById('logoutLink');
  
        if (sessionToken) {
          // Render authenticated navbar
          loginLinkEl.style.display = 'none';
          joinLinkEl.style.display = 'none';
          logoutLinkEl.style.display = 'block';
        } else {
          // Render unauthenticated navbar
          loginLinkEl.style.display = 'block';
          joinLinkEl.style.display = 'block';
          logoutLinkEl.style.display = 'none';
        }
      }
  
      // Call the updateNavbar function when the page loads
      window.onload = updateNavbar;