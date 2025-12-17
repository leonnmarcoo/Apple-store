// Dynamically load iPhone products from the database
async function loadIPhoneProducts() {
    try {
        const response = await fetch('/api/products?type=iPhone');
        const products = await response.json();

        const container = document.querySelector('.products-card-main-container');
        
        if (!products || products.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">No iPhone products available yet.</p>';
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Create rows with 3 products each
        for (let i = 0; i < products.length; i += 3) {
            const row = document.createElement('div');
            row.className = 'product-card-row';

            // Add up to 3 products per row
            for (let j = i; j < i + 3 && j < products.length; j++) {
                const product = products[j];
                const card = createProductCard(product);
                row.appendChild(card);
            }

            container.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading iPhone products:', error);
        document.querySelector('.products-card-main-container').innerHTML = 
            '<p style="text-align: center; padding: 20px;">Error loading products. Please try again later.</p>';
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info-main-container">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p class="price-range">From ${product.price}</p>
            <button class="buy-button-products">Buy</button>
        </div>
    `;

    return card;
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadIPhoneProducts);
