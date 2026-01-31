// Mac Store Product Loader
document.addEventListener('DOMContentLoaded', () => {
    loadMacProducts();
});

async function loadMacProducts() {
    try {
        const response = await fetch('/api/products?type=Mac');
        const products = await response.json();
        
        const container = document.getElementById('mac-products-container');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No Mac products available yet.</p>';
            return;
        }

        container.innerHTML = '';
        
        products.forEach((product) => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading Mac products:', error);
        const container = document.getElementById('mac-products-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; padding: 40px; color: #f00;">Failed to load products.</p>';
        }
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageSrc = product.image || 'assets/Products/Mac/Mac1.png';
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${imageSrc}" alt="${product.name}" onerror="this.src='assets/Products/Mac/Mac1.png'">
        </div>
        <div class="product-info-main-container">
            <h2>${product.name}</h2>
            ${product.chipInfo ? `<p class="chip-info">${product.chipInfo}</p>` : ''}
            <p class="product-description">${product.description}</p>
            <p class="price-range">From ₱${product.price.toLocaleString()}</p>
            <button class="buy-button-products">Buy</button>
        </div>
    `;
    
    return card;
}
