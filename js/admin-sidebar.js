// ============================================
// ADMIN SIDEBAR NAVIGATION
// ============================================

// Toggle sidebar collapse
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    
    // Save state to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Toggle mobile sidebar
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    // Restore sidebar state on desktop
    if (window.innerWidth > 968) {
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        }
    }
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 968) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnMenuBtn = mobileMenuBtn && mobileMenuBtn.contains(e.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuBtn && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
    
    // Highlight active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        }
    });
    
    // Load user info
    loadUserInfo();
});

// Load user information
function loadUserInfo() {
    const userNameElement = document.getElementById('userName');
    if (!userNameElement) return;
    
    // Try to get user info from storage
    let userInfo = JSON.parse(localStorage.getItem('churchAdminUser'));
    if (!userInfo) {
        userInfo = JSON.parse(sessionStorage.getItem('churchAdminUser'));
    }
    
    if (userInfo) {
        userNameElement.textContent = userInfo.username;
    }
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Tab switching function
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.closest('.tab-btn').classList.add('active');
}

// Export data function (placeholder)
function exportData(dataType) {
    console.log(`Exporting ${dataType} data...`);
    alert(`Export feature coming soon!\n\nThis will export ${dataType} data to Excel/CSV format.`);
    
    // PRODUCTION: Implement actual export
    // Example with CSV:
    /*
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}_${new Date().toISOString()}.csv`;
    a.click();
    */
}

// Generate report function (placeholder)
function generateReport(reportType) {
    console.log(`Generating ${reportType} report...`);
    alert(`Report generation coming soon!\n\nThis will generate a ${reportType} report in PDF format.`);
    
    // PRODUCTION: Implement with PDF library like jsPDF or backend API
}

// Utility: Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility: Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility: Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
