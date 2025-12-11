// Enhanced Apple Store Website JavaScript with Authentication

document.addEventListener('DOMContentLoaded', async () => {
	// Check authentication status on page load
	await checkAuthStatus();

	// Navigate to login page when the Profile icon button is clicked
	const profileBtn = document.getElementById('profile-button');
	if (profileBtn) {
		profileBtn.addEventListener('click', async () => {
			// Check if user is logged in
			const authStatus = await checkAuthStatus();
			if (authStatus.authenticated) {
				// Show user menu or logout option
				showUserMenu(authStatus.username);
			} else {
				window.location.href = 'login.html';
			}
		});
	}

	// Ensure login page footer link navigates to sign-up
	const signupLink = document.querySelector('.login-link');
	if (signupLink) {
		signupLink.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'sign-up.html';
		});
	}

	// On sign-up page, make the footer 'Log in' link navigate back to login.html
	const signUpLoginLink = document.querySelector('.signup-login-link');
	if (signUpLoginLink) {
		signUpLoginLink.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'login.html';
		});
	}
});

// Function to check authentication status
async function checkAuthStatus() {
	try {
		const response = await fetch('/api/auth-check');
		const data = await response.json();
		
		// Update UI based on authentication status
		updateUIForAuthStatus(data);
		
		return data;
	} catch (error) {
		console.error('Auth check error:', error);
		return { authenticated: false };
	}
}

// Function to update UI based on authentication status
function updateUIForAuthStatus(authData) {
	const profileBtn = document.getElementById('profile-button');
	
	if (profileBtn && authData.authenticated) {
		// Update profile button to show user is logged in
		profileBtn.title = `Logged in as ${authData.username}`;
		
		// Add visual indicator (you can customize this)
		if (!profileBtn.querySelector('.auth-indicator')) {
			const indicator = document.createElement('span');
			indicator.className = 'auth-indicator';
			indicator.style.cssText = `
				position: absolute;
				top: -2px;
				right: -2px;
				width: 8px;
				height: 8px;
				background: #34d399;
				border-radius: 50%;
				border: 2px solid white;
			`;
			profileBtn.style.position = 'relative';
			profileBtn.appendChild(indicator);
		}
	}
}

// Function to show user menu
function showUserMenu(username) {
	// Remove existing menu if any
	const existingMenu = document.querySelector('.user-menu');
	if (existingMenu) {
		existingMenu.remove();
		return;
	}

	// Create user menu
	const menu = document.createElement('div');
	menu.className = 'user-menu';
	menu.style.cssText = `
		position: fixed;
		top: 60px;
		right: 20px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 12px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		z-index: 1000;
		min-width: 200px;
	`;

	menu.innerHTML = `
		<div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 8px;">
			<strong>Welcome, ${username}!</strong>
		</div>
		<button id="logout-btn" style="
			width: 100%;
			padding: 8px 12px;
			background: #dc2626;
			color: white;
			border: none;
			border-radius: 6px;
			cursor: pointer;
			font-size: 14px;
		">Logout</button>
	`;

	document.body.appendChild(menu);

	// Add logout functionality
	document.getElementById('logout-btn').addEventListener('click', logout);

	// Close menu when clicking outside
	setTimeout(() => {
		document.addEventListener('click', function closeMenu(e) {
			if (!menu.contains(e.target) && !document.getElementById('profile-button').contains(e.target)) {
				menu.remove();
				document.removeEventListener('click', closeMenu);
			}
		});
	}, 100);
}

// Function to logout
async function logout() {
	try {
		const response = await fetch('/api/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();

		if (response.ok) {
			// Remove any authentication indicators
			const indicator = document.querySelector('.auth-indicator');
			if (indicator) {
				indicator.remove();
			}

			// Remove user menu
			const menu = document.querySelector('.user-menu');
			if (menu) {
				menu.remove();
			}

			// Redirect to login page
			window.location.href = data.redirect || '/login.html';
		} else {
			alert('Logout failed. Please try again.');
		}
	} catch (error) {
		console.error('Logout error:', error);
		alert('Network error during logout. Please try again.');
	}
}

// Function to require authentication for protected pages
function requireAuth() {
	checkAuthStatus().then(authData => {
		if (!authData.authenticated) {
			window.location.href = '/login.html';
		}
	});
}

// Export functions for use in other scripts
window.appleStoreAuth = {
	checkAuthStatus,
	logout,
	requireAuth
};

