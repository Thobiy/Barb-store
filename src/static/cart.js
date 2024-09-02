
//display cart details
document.addEventListener('DOMContentLoaded', async function() {
    const cartItemsContainer = document.getElementById('cart-items-container');

    async function fetchCartItems() {
        try {
            const response = await fetch('http://localhost:5000/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensures cookies are sent with request
            });

            const cartItems = await response.json();

            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                return;
            }

            // Display each cart item
            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching cart items:', error);
            cartItemsContainer.innerHTML = '<p>Error loading cart items.</p>';
        }
    }

    // Fetch and display cart items when the page loads
    fetchCartItems();
});




//end



document.addEventListener('DOMContentLoaded', function() {
    const cartCount = document.getElementById('cart-count');

    async function addToCart(productId) {
        try {
            const response = await fetch('http://localhost:5000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            const data = await response.json();
            cartCount.textContent = data.cartItemCount; // Update with server response

        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
});
