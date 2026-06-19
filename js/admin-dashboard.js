// ============================================
// ADMIN DASHBOARD
// ============================================

// Sample activity data
const recentActivity = [
    {
        icon: 'fa-user-plus',
        title: 'New Member Added',
        description: 'Marie Laurent joined the church family',
        time: '2 hours ago'
    },
    {
        icon: 'fa-dollar-sign',
        title: 'Donation Received',
        description: '$250 donation from Jean Baptiste',
        time: '4 hours ago'
    },
    {
        icon: 'fa-calendar-check',
        title: 'Event Created',
        description: '3 Days of Intimacy with God scheduled',
        time: '1 day ago'
    },
    {
        icon: 'fa-bullhorn',
        title: 'Announcement Posted',
        description: 'Sunday service time update published',
        time: '2 days ago'
    },
    {
        icon: 'fa-users',
        title: 'Ministry Update',
        description: 'Youth Ministry added 5 new volunteers',
        time: '3 days ago'
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadRecentActivity();
    checkUserAuthentication();
});

// Load dashboard statistics
function loadDashboardStats() {
    // Sample data - replace with actual API calls
    const stats = {
        totalMembers: 324,
        totalDonations: 12450,
        upcomingEvents: 2,
        activeMinistries: 8
    };
    
    // Animate counters
    animateCounter('totalMembers', 0, stats.totalMembers, 1500);
    animateCounter('totalDonations', 0, stats.totalDonations, 1500, true);
    
    document.getElementById('upcomingEvents').textContent = stats.upcomingEvents;
    document.getElementById('activeMinistries').textContent = stats.activeMinistries;
}

// Animate counter numbers
function animateCounter(elementId, start, end, duration, isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        if (isCurrency) {
            element.textContent = formatCurrency(Math.floor(current));
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Load recent activity feed
function loadRecentActivity() {
    const activityFeed = document.getElementById('activityFeed');
    if (!activityFeed) return;
    
    activityFeed.innerHTML = recentActivity.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-details" style="flex: 1;">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <span class="activity-time">${activity.time}</span>
        </div>
    `).join('');
}

// Check user authentication
function checkUserAuthentication() {
    let userInfo = JSON.parse(localStorage.getItem('churchAdminUser'));
    if (!userInfo) {
        userInfo = JSON.parse(sessionStorage.getItem('churchAdminUser'));
    }
    
    // In demo mode, redirect to login if no user info
    // In production, check auth token validity
    if (!userInfo) {
        // Uncomment for production:
        // window.location.href = 'admin-login.html';
    }
}

// Format currency helper
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

// ============================================
// PRODUCTION READY: API Integration
// ============================================

/*
// Fetch real dashboard data from API
async function fetchDashboardData() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        updateDashboardStats(data);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

// Fetch recent activity from API
async function fetchRecentActivity() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/activity/recent?limit=5', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch activity');
        }
        
        const activities = await response.json();
        renderActivityFeed(activities);
    } catch (error) {
        console.error('Error fetching activity:', error);
    }
}
*/
