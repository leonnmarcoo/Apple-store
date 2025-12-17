// Admin Page Product Management
let currentProductId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    const createBtn = document.getElementById('create');
    const updateBtn = document.getElementById('update');
    const deleteBtn = document.getElementById('delete');

    if (createBtn) {
        createBtn.addEventListener('click', handleCreate);
    }
    if (updateBtn) {
        updateBtn.addEventListener('click', handleUpdate);
    }
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDelete);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.dataset.productId = product._id;
            row.innerHTML = `
                <td>${product._id.slice(-6)}</td>
                <td>${product.name}</td>
                <td>${product.type}</td>
                <td>₱${product.price.toLocaleString()}</td>
                <td>${product.chipInfo || 'N/A'}</td>
                <td>
                    <button class="select-btn" onclick="selectProduct('${product._id}')">Select</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products');
    }
}

function selectProduct(productId) {
    currentProductId = productId;
    
    document.querySelectorAll('#products-table-body tr').forEach(row => {
        row.classList.remove('selected');
    });

    const selectedRow = document.querySelector(`tr[data-product-id="${productId}"]`);
    if (selectedRow) {
        selectedRow.classList.add('selected');
    }

    loadProductIntoForm(productId);
}

async function loadProductIntoForm(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        document.querySelector('input[name="product_name"]').value = product.name;
        document.querySelector('select[name="product_type"]').value = product.type;
        document.querySelector('input[name="product_price"]').value = product.price;
        document.querySelector('input[name="product_description"]').value = product.description;
        document.querySelector('input[name="product_chip"]').value = product.chipInfo || '';
        
        const fileInput = document.querySelector('input[name="product_image"]');
        if (product.image) {
            let preview = document.getElementById('image-preview');
            if (!preview) {
                preview = document.createElement('div');
                preview.id = 'image-preview';
                preview.style.marginTop = '5px';
                preview.style.fontSize = '12px';
                preview.style.color = '#666';
                fileInput.parentElement.appendChild(preview);
            }
            preview.innerHTML = `Current: <a href="${product.image}" target="_blank">View Image</a>`;
        }
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product details');
    }
}

async function handleCreate() {
    const name = document.querySelector('input[name="product_name"]').value;
    const type = document.querySelector('select[name="product_type"]').value;
    const price = document.querySelector('input[name="product_price"]').value;
    const description = document.querySelector('input[name="product_description"]').value;
    const chipInfo = document.querySelector('input[name="product_chip"]').value;
    const imageFile = document.querySelector('input[name="product_image"]').files[0];

    if (!name || !type || !price || !description) {
        alert('Please fill in all required fields (Name, Type, Price, Description)');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('chipInfo', chipInfo);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Product created successfully!');
            clearForm();
            loadProducts();
        } else {
            const error = await response.json();
            alert('Failed to create product: ' + error.error);
        }
    } catch (error) {
        console.error('Error creating product:', error);
        alert('Failed to create product');
    }
}

async function handleUpdate() {
    if (!currentProductId) {
        alert('Please select a product to update');
        return;
    }

    const name = document.querySelector('input[name="product_name"]').value;
    const type = document.querySelector('select[name="product_type"]').value;
    const price = document.querySelector('input[name="product_price"]').value;
    const description = document.querySelector('input[name="product_description"]').value;
    const chipInfo = document.querySelector('input[name="product_chip"]').value;
    const imageFile = document.querySelector('input[name="product_image"]').files[0];

    if (!name || !type || !price || !description) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('chipInfo', chipInfo);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await fetch(`/api/products/${currentProductId}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            alert('Product updated successfully!');
            clearForm();
            currentProductId = null;
            loadProducts();
        } else {
            const error = await response.json();
            alert('Failed to update product: ' + error.error);
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
    }
}

async function handleDelete() {
    if (!currentProductId) {
        alert('Please select a product to delete');
        return;
    }

    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${currentProductId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Product deleted successfully!');
            clearForm();
            currentProductId = null;
            loadProducts();
        } else {
            const error = await response.json();
            alert('Failed to delete product: ' + error.error);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
    }
}

function clearForm() {
    document.querySelector('input[name="product_name"]').value = '';
    document.querySelector('select[name="product_type"]').value = '';
    document.querySelector('input[name="product_price"]').value = '';
    document.querySelector('input[name="product_description"]').value = '';
    document.querySelector('input[name="product_chip"]').value = '';
    document.querySelector('input[name="product_image"]').value = '';
    
    const preview = document.getElementById('image-preview');
    if (preview) {
        preview.remove();
    }
    
    document.querySelectorAll('#products-table-body tr').forEach(row => {
        row.classList.remove('selected');
    });
    
    currentProductId = null;
}
