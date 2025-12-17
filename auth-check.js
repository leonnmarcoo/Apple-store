// Authentication check for buy buttons
async function checkAuthentication() {
    try {
        const response = await fetch('/api/auth-check');
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Setup buy button authentication check
function setupBuyButtons() {
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('buy-button-products')) {
            event.preventDefault();
            
            const isAuthenticated = await checkAuthentication();
            
            if (!isAuthenticated) {
                // Store the current page to return after login
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                window.location.href = 'login.html';
            } else {
                // User is logged in, proceed with purchase/cart logic
                // TODO: Add to cart functionality here
                alert('Product will be added to cart (feature coming soon)');
            }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', setupBuyButtons);
