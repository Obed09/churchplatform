// ============================================
// ADMIN AUTHENTICATION
// ============================================

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const department = document.getElementById('department').value;
    const remember = document.getElementById('remember').checked;
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    try {
        let authenticatedUser = null;

        // Preferred path: validate against Supabase authorized users table
        if (typeof validateAuthorizedUser === 'function') {
            authenticatedUser = await validateAuthorizedUser(username, password, department);
        }

        // Fallback path: if table not set yet, keep legacy demo login behavior
        if (!authenticatedUser && await isLikelyBootstrapState()) {
            authenticatedUser = {
                username: username,
                full_name: username,
                role: 'Demo Access',
                department: department,
                access_level: 'manager',
                id: null
            };
            showMessage('Authorized users table not configured yet. Logged in with temporary fallback.', 'warning');
        }

        if (!authenticatedUser) {
            showMessage('Invalid credentials or department access denied.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        const userInfo = {
            id: authenticatedUser.id || null,
            username: authenticatedUser.username,
            fullName: authenticatedUser.full_name || authenticatedUser.fullName || authenticatedUser.username,
            role: authenticatedUser.role,
            department: authenticatedUser.department,
            accessLevel: authenticatedUser.access_level || authenticatedUser.accessLevel,
            loginTime: new Date().toISOString()
        };

        if (remember) {
            localStorage.setItem('churchAdminUser', JSON.stringify(userInfo));
        } else {
            sessionStorage.setItem('churchAdminUser', JSON.stringify(userInfo));
        }

        if (authenticatedUser.id && typeof updateAuthorizedUserLastLogin === 'function') {
            try {
                await updateAuthorizedUserLastLogin(authenticatedUser.id);
            } catch (updateError) {
                console.warn('Could not update last login timestamp:', updateError);
            }
        }

        showMessage('Login successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 900);
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Login failed. Check authorized users setup and try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

async function isLikelyBootstrapState() {
    if (typeof validateAuthorizedUser !== 'function') return true;
    if (typeof getAuthorizedUsers !== 'function') return true;

    try {
        const users = await getAuthorizedUsers();
        return !users || users.length === 0;
    } catch (error) {
        console.warn('Could not check authorized users table; enabling temporary fallback.', error);
        return true;
    }
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = message;
    messageDiv.className = `login-message ${type}`;
    messageDiv.style.display = 'block';
}

// Forgot password function
function forgotPassword() {
    alert('Please contact the church administrator for password reset assistance.\n\nPhone: 829-377-1099 or 829-303-0241');
}

// ============================================
// PRODUCTION READY: Comment in for real authentication
// ============================================

/*
// Real authentication with backend API
async function authenticateUser(username, password, department) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                department: department
            })
        });
        
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        
        // Store JWT token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('churchAdminUser', JSON.stringify(data.user));
        
        return true;
    } catch (error) {
        console.error('Authentication error:', error);
        return false;
    }
}

// Check authentication on protected pages
function checkAuth() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('churchAdminUser');
    sessionStorage.clear();
    window.location.href = 'admin-login.html';
}
*/
