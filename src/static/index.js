
/*


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

*/

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const joinLink = document.getElementById('joinLink');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Important to include cookies in the request
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data.message);
                window.location.reload(); // Reload to update the navbar
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });

    // Check authentication status to update the navbar
    async function checkAuthStatus() {
        try {
            const response = await fetch('http://localhost:5000/auth-status', {
                method: 'GET',
                credentials: 'include' // Include credentials to send cookies
            });

            const data = await response.json();

            if (data.authenticated) {
                joinLink.style.display = 'none';
                loginLink.style.display = 'none';
                logoutLink.style.display = 'inline';

                // Handle logout
                logoutLink.addEventListener('click', async function () {
                    await fetch('http://localhost:5000/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });
                    window.location.reload();
                });

            } else {
                joinLink.style.display = 'inline';
                loginLink.style.display = 'inline';
                logoutLink.style.display = 'none';
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            // Default to showing login/join if there's an error
            joinLink.style.display = 'inline';
            loginLink.style.display = 'inline';
            logoutLink.style.display = 'none';
        }
    }

    checkAuthStatus(); // Call the function to check the authentication status when the page loads
});



// Function to add product to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.productId === productId);

    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Product added to cart:', productId);
}

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        addToCart(productId);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const cartCount = document.getElementById('cart-count');

    // Retrieve cart from localStorage (or sessionStorage)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update cart count in navbar
    cartCount.textContent = cart.length;

    // Function to add product to cart
    function addToCart(productId) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCount.textContent = cart.length; // Update cart count
    }

    // Example of adding a product (use your actual event)
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
});
