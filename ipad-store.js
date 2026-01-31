// Dynamically load iPad products from the database
async function loadIPadProducts() {
    try {
        const response = await fetch('/api/products?type=iPad');
        const products = await response.json();

        const container = document.getElementById('ipad-products-container');
        if (!container) return;
        
        if (!products || products.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">No iPad products available yet.</p>';
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Add products directly to container (horizontal scroll)
        products.forEach((product) => {
            const card = createProductCard(product);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading iPad products:', error);
        const container = document.getElementById('ipad-products-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Error loading products. Please try again later.</p>';
        }
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const formattedPrice = `₱${parseFloat(product.price).toLocaleString()}`;
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/Products/iPad/iPad1.png'">
        </div>
        <div class="product-info-main-container">
            <h2>${product.name}</h2>
            ${product.chipInfo ? `<p class="chip-info">${product.chipInfo}</p>` : ''}
            <p class="product-description">${product.description}</p>
            <p class="price-range">From ${formattedPrice}</p>
            <button class="buy-button-products">Buy</button>
        </div>
    `;

    return card;
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadIPadProducts);
