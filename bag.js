// Bag functionality for Apple Store

// Initialize bag from localStorage
function getBag() {
    const bag = localStorage.getItem('appleBag');
    return bag ? JSON.parse(bag) : [];
}

// Save bag to localStorage
function saveBag(bag) {
    localStorage.setItem('appleBag', JSON.stringify(bag));
}

// Add product to bag
function addToBag(product) {
    const bag = getBag();
    const existingIndex = bag.findIndex(item => item._id === product._id);
    
    if (existingIndex === -1) {
        bag.push({ ...product, quantity: 1 });
    } else {
        bag[existingIndex].quantity += 1;
    }
    
    saveBag(bag);
    return true;
}

// Remove product from bag
function removeFromBag(productId) {
    let bag = getBag();
    bag = bag.filter(item => item._id !== productId);
    saveBag(bag);
}

// Update product quantity in bag
function updateQuantity(productId, newQuantity) {
    const bag = getBag();
    const index = bag.findIndex(item => item._id === productId);
    
    if (index !== -1) {
        if (newQuantity <= 0) {
            bag.splice(index, 1);
        } else {
            bag[index].quantity = newQuantity;
        }
        saveBag(bag);
    }
    
    return bag;
}

// Check if product is in bag
function isInBag(productId) {
    const bag = getBag();
    return bag.some(item => item._id === productId);
}

// Calculate total price
function calculateTotal() {
    const bag = getBag();
    return bag.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + (price * item.quantity);
    }, 0);
}

// Format price with peso sign
function formatPrice(price) {
    return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Render bag items on bag.html page
function renderBagItems() {
    const container = document.getElementById('bag-products-container');
    const totalSection = document.getElementById('bag-total-section');
    const totalPriceEl = document.getElementById('bag-total-price');
    
    if (!container) return;
    
    const bag = getBag();
    
    if (bag.length === 0) {
        container.innerHTML = '<p class="empty-bag-message">Your bag is empty.</p>';
        if (totalSection) totalSection.style.display = 'none';
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Render each bag item
    bag.forEach(item => {
        const bagItem = createBagItemElement(item);
        container.appendChild(bagItem);
    });
    
    // Show total section and update price
    if (totalSection) {
        totalSection.style.display = 'flex';
    }
    
    if (totalPriceEl) {
        totalPriceEl.textContent = formatPrice(calculateTotal());
    }
}

// Create bag item element
function createBagItemElement(item) {
    const element = document.createElement('div');
    element.className = 'bag-product-container';
    element.dataset.productId = item._id;
    
    element.innerHTML = `
        <div class="bag-product-info">
            <div class="bag-product-photo">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/Products/iPhone/iPhone1.png'">
            </div>
            <p class="bag-product-name">${item.name}</p>
        </div>
        <div class="bag-product-price-quantity">
            <p class="bag-product-price">${formatPrice(item.price)}</p>
            <div class="bag-quantity-control">
                <button class="qty-btn subtract-btn" data-id="${item._id}">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn add-btn" data-id="${item._id}">+</button>
            </div>
        </div>
    `;
    
    // Add event listeners for quantity buttons
    const subtractBtn = element.querySelector('.subtract-btn');
    const addBtn = element.querySelector('.add-btn');
    const qtyValue = element.querySelector('.qty-value');
    
    subtractBtn.addEventListener('click', () => {
        const newQty = item.quantity - 1;
        if (newQty <= 0) {
            element.remove();
        } else {
            item.quantity = newQty;
            qtyValue.textContent = newQty;
        }
        updateQuantity(item._id, newQty);
        updateTotalPrice();
        updateAddButtonStates();
        
        // Check if bag is now empty
        if (getBag().length === 0) {
            renderBagItems();
        }
    });
    
    addBtn.addEventListener('click', () => {
        const newQty = item.quantity + 1;
        item.quantity = newQty;
        qtyValue.textContent = newQty;
        updateQuantity(item._id, newQty);
        updateTotalPrice();
    });
    
    return element;
}

// Update total price display
function updateTotalPrice() {
    const totalPriceEl = document.getElementById('bag-total-price');
    if (totalPriceEl) {
        totalPriceEl.textContent = formatPrice(calculateTotal());
    }
}

// Update Add button states on product pages (to show Added)
function updateAddButtonStates() {
    const buttons = document.querySelectorAll('.add-button-products');
    buttons.forEach(btn => {
        const productId = btn.dataset.productId;
        if (productId && isInBag(productId)) {
            btn.classList.add('added');
            btn.textContent = 'Added';
        } else {
            btn.classList.remove('added');
            btn.textContent = 'Add';
        }
    });
}

// Handle Add button click on product pages
function handleAddButtonClick(button, product) {
    if (isInBag(product._id)) {
        // Remove from bag
        removeFromBag(product._id);
        button.classList.remove('added');
        button.textContent = 'Add';
    } else {
        // Add to bag
        addToBag(product);
        button.classList.add('added');
        button.textContent = 'Added';
    }
}

// Checkout function - creates order in database
async function checkout() {
    const bag = getBag();
    
    if (bag.length === 0) {
        alert('Your bag is empty!');
        return;
    }

    // Prepare products array for order
    const products = bag.map(item => ({
        productId: item._id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image
    }));

    const total = calculateTotal();

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products,
                total
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Clear the bag after successful checkout
            localStorage.removeItem('appleBag');
            alert('Order placed successfully! Your order ID is: ' + data.orderId);
            // Refresh the page to show empty bag
            window.location.reload();
        } else {
            alert('Failed to place order: ' + data.error);
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to place order. Please try again.');
    }
}

// Initialize bag page
document.addEventListener('DOMContentLoaded', () => {
    // If on bag page, render items
    if (document.getElementById('bag-products-container')) {
        renderBagItems();
        
        // Setup checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkout);
        }
    }
    
    // Update Add button states on any page
    updateAddButtonStates();
});

// Export functions for use in other files
window.bagFunctions = {
    addToBag,
    removeFromBag,
    getBag,
    isInBag,
    handleAddButtonClick,
    updateAddButtonStates
};
