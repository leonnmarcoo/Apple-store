// Admin Users Page - Load and manage users

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupDeleteButton();
});

let selectedUserId = null;

async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No users found.</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.userId = user._id;
            
            const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
            
            row.innerHTML = `
                <td>${user._id.slice(-6)}</td>
                <td>${user.username || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${createdAt}</td>
                <td><button class="select-btn" data-id="${user._id}">Select</button></td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add click handlers for select buttons
        document.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectUser(btn.dataset.id);
            });
        });
        
    } catch (error) {
        console.error('Error loading users:', error);
        const tbody = document.getElementById('users-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: red;">Error loading users.</td></tr>';
        }
    }
}

function selectUser(userId) {
    // Remove previous selection
    document.querySelectorAll('#users-table-body tr').forEach(row => {
        row.classList.remove('selected');
    });
    
    // Select new row
    const row = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (row) {
        row.classList.add('selected');
        selectedUserId = userId;
    }
}

function setupDeleteButton() {
    const deleteBtn = document.getElementById('delete-user');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!selectedUserId) {
                alert('Please select a user to delete.');
                return;
            }
            
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`/api/users/${selectedUserId}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        alert('User deleted successfully!');
                        selectedUserId = null;
                        loadUsers();
                    } else {
                        const error = await response.json();
                        alert('Error deleting user: ' + (error.message || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Error deleting user. Please try again.');
                }
            }
        });
    }
}
