// Admin Orders Page - Load and manage orders

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    setupButtons();
});

let selectedOrderId = null;

async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;
        
        if (!orders || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No orders found.</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.dataset.orderId = order._id;
            
            const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
            const products = order.products ? order.products.map(p => p.name || 'Unknown').join(', ') : 'N/A';
            const total = order.total ? `₱${parseFloat(order.total).toLocaleString()}` : 'N/A';
            const status = order.status || 'Pending';
            const userName = order.userId?.username || order.guestName || 'Guest';
            
            row.innerHTML = `
                <td>${order._id.slice(-6)}</td>
                <td>${userName}</td>
                <td>${products.length > 30 ? products.substring(0, 30) + '...' : products}</td>
                <td>${total}</td>
                <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
                <td>${orderDate}</td>
                <td><button class="select-btn" data-id="${order._id}">Select</button></td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add click handlers for select buttons
        document.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectOrder(btn.dataset.id);
            });
        });
        
    } catch (error) {
        console.error('Error loading orders:', error);
        const tbody = document.getElementById('orders-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: red;">Error loading orders.</td></tr>';
        }
    }
}

function selectOrder(orderId) {
    // Remove previous selection
    document.querySelectorAll('#orders-table-body tr').forEach(row => {
        row.classList.remove('selected');
    });
    
    // Select new row
    const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
    if (row) {
        row.classList.add('selected');
        selectedOrderId = orderId;
    }
}

function setupButtons() {
    const updateBtn = document.getElementById('update-status');
    const deleteBtn = document.getElementById('delete-order');
    
    if (updateBtn) {
        updateBtn.addEventListener('click', async () => {
            if (!selectedOrderId) {
                alert('Please select an order to update.');
                return;
            }
            
            const newStatus = prompt('Enter new status (Pending, Processing, Shipped, Delivered, Cancelled):');
            if (!newStatus) return;
            
            const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
            if (!validStatuses.includes(newStatus)) {
                alert('Invalid status. Please use: ' + validStatuses.join(', '));
                return;
            }
            
            try {
                const response = await fetch(`/api/orders/${selectedOrderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                
                if (response.ok) {
                    alert('Order status updated successfully!');
                    loadOrders();
                } else {
                    const error = await response.json();
                    alert('Error updating order: ' + (error.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error updating order:', error);
                alert('Error updating order. Please try again.');
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!selectedOrderId) {
                alert('Please select an order to delete.');
                return;
            }
            
            if (confirm('Are you sure you want to delete this order?')) {
                try {
                    const response = await fetch(`/api/orders/${selectedOrderId}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        alert('Order deleted successfully!');
                        selectedOrderId = null;
                        loadOrders();
                    } else {
                        const error = await response.json();
                        alert('Error deleting order: ' + (error.message || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error deleting order:', error);
                    alert('Error deleting order. Please try again.');
                }
            }
        });
    }
}
