// ============================================
// EVENTS MANAGEMENT
// ============================================

// Sample events data - using real church events
const churchEvents = [
    {
        id: 1,
        title: '3 Days of Intimacy with God',
        description: 'A powerful three-day spiritual retreat focused on deepening your relationship with God through prayer, worship, and fellowship.',
        startDate: '2026-06-12T09:00:00',
        endDate: '2026-06-14T21:00:00',
        location: 'Church Main Hall',
        category: 'conference',
        coordinator: 'Pastor Emmanuel Dieujuste',
        capacity: 200,
        registered: 145,
        requiresRegistration: true,
        status: 'upcoming'
    },
    {
        id: 2,
        title: '40 Days of Prayer: God is Our Guide and Provider',
        description: 'Join us for 40 consecutive days of dedicated prayer, seeking God\'s guidance and provision in our lives and church community.',
        startDate: '2026-06-17T07:00:00',
        endDate: '2026-07-26T21:00:00',
        location: 'Church Prayer Room',
        category: 'prayer',
        coordinator: 'Marie-Claire Joseph',
        capacity: null,
        registered: 87,
        requiresRegistration: true,
        status: 'upcoming'
    }
];

// Initialize events page
document.addEventListener('DOMContentLoaded', function() {
    loadEventsStats();
    renderUpcomingEvents();
    initializeEventForm();
    initializeCalendar();
});

// Load events statistics
function loadEventsStats() {
    const upcomingCount = churchEvents.filter(e => e.status === 'upcoming').length;
    const totalRegistrations = churchEvents.reduce((sum, e) => sum + e.registered, 0);
    const activeEvents = churchEvents.filter(e => e.status === 'active').length;
    const completedEvents = 0; // YTD completed events
    
    document.getElementById('upcomingEvents').textContent = upcomingCount;
    document.getElementById('totalRegistrations').textContent = totalRegistrations;
    document.getElementById('activeEvents').textContent = activeEvents;
    document.getElementById('completedEvents').textContent = completedEvents;
}

// Render upcoming events cards
function renderUpcomingEvents() {
    const container = document.getElementById('upcomingEventsGrid');
    if (!container) return;
    
    container.innerHTML = churchEvents.map(event => `
        <div class="event-card">
            <div class="event-header">
                <span class="event-category ${event.category}">${event.category}</span>
                <span class="event-status ${event.status}">${event.status}</span>
            </div>
            <h3>${event.title}</h3>
            <p class="event-description">${event.description}</p>
            <div class="event-details">
                <div class="event-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${formatEventDate(event.startDate, event.endDate)}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-clock"></i>
                    <span>${formatEventTime(event.startDate)}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-user"></i>
                    <span>${event.coordinator}</span>
                </div>
                ${event.capacity ? `
                    <div class="event-detail">
                        <i class="fas fa-users"></i>
                        <span>${event.registered} / ${event.capacity} registered</span>
                    </div>
                ` : `
                    <div class="event-detail">
                        <i class="fas fa-users"></i>
                        <span>${event.registered} registered</span>
                    </div>
                `}
            </div>
            <div class="event-actions">
                <button class="btn-secondary" onclick="viewEvent(${event.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn-primary" onclick="manageRegistrations(${event.id})">
                    <i class="fas fa-users"></i> Registrations
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize event form
function initializeEventForm() {
    const form = document.getElementById('eventForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newEvent = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDescription').value,
            startDate: document.getElementById('eventStartDate').value,
            endDate: document.getElementById('eventEndDate').value,
            location: document.getElementById('eventLocation').value,
            category: document.getElementById('eventCategory').value,
            capacity: document.getElementById('eventCapacity').value || null,
            requiresRegistration: document.getElementById('eventRequiresRegistration').checked,
            coordinator: document.getElementById('eventCoordinator').value,
            notes: document.getElementById('eventNotes').value
        };
        
        console.log('New event created:', newEvent);
        
        alert(`Event created successfully!\n\nTitle: ${newEvent.title}\nDate: ${formatDate(newEvent.startDate)}\nLocation: ${newEvent.location}`);
        
        closeModal('eventModal');
        form.reset();
        
        // Refresh events display
        renderUpcomingEvents();
        loadEventsStats();
    });
}

// Initialize calendar
function initializeCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    // Simple calendar display - can be enhanced with a library like FullCalendar
    calendarGrid.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-light);">Calendar view coming soon! Use List View to see all events.</p>';
}

// View toggle
function switchView(view) {
    const calendarView = document.getElementById('calendar-view');
    const listView = document.getElementById('list-view');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    
    if (view === 'calendar') {
        calendarView.style.display = 'block';
        listView.style.display = 'none';
    } else {
        calendarView.style.display = 'none';
        listView.style.display = 'block';
        renderEventsList();
    }
}

// Render events list view
function renderEventsList() {
    const container = document.getElementById('eventsListContainer');
    if (!container) return;
    
    container.innerHTML = churchEvents.map(event => `
        <div class="event-list-item">
            <div class="event-date-badge">
                <div class="date-day">${new Date(event.startDate).getDate()}</div>
                <div class="date-month">${new Date(event.startDate).toLocaleString('en-US', { month: 'short' })}</div>
            </div>
            <div class="event-list-details">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
                <div class="event-meta">
                    <span><i class="fas fa-clock"></i> ${formatEventTime(event.startDate)}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    <span><i class="fas fa-users"></i> ${event.registered} registered</span>
                </div>
            </div>
            <div class="event-list-actions">
                <button class="btn-secondary" onclick="editEvent(${event.id})">Edit</button>
                <button class="btn-primary" onclick="viewEvent(${event.id})">View</button>
            </div>
        </div>
    `).join('');
}

// Filter events
function filterEvents() {
    const filter = document.getElementById('eventFilter').value;
    console.log('Filtering events by:', filter);
    // Implement actual filtering logic
    renderEventsList();
}

// Action functions
function viewEvent(id) {
    const event = churchEvents.find(e => e.id === id);
    if (event) {
        alert(`Event Details:\n\n${event.title}\n\nDate: ${formatEventDate(event.startDate, event.endDate)}\nTime: ${formatEventTime(event.startDate)}\nLocation: ${event.location}\nCoordinator: ${event.coordinator}\n\nRegistrations: ${event.registered}${event.capacity ? ` / ${event.capacity}` : ''}\n\nDescription: ${event.description}`);
    }
}

function editEvent(id) {
    alert(`Edit event ${id}\n\nThis will open the edit form with event details.`);
}

function manageRegistrations(id) {
    const event = churchEvents.find(e => e.id === id);
    if (event) {
        alert(`Manage Registrations for:\n${event.title}\n\nTotal Registered: ${event.registered}\n\nThis will open the registrations management interface.`);
    }
}

// Calendar navigation
let currentMonth = new Date(2026, 5); // June 2026

function previousMonth() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    updateCalendar();
}

function nextMonth() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    updateCalendar();
}

function updateCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = 
        `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    
    // Regenerate calendar grid
    initializeCalendar();
}

// Date formatting utilities
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatEventDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
        return formatDate(startDate);
    } else {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
}

function formatEventTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Add event card styles
const eventCardStyles = `
<style>
.event-card {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    transition: var(--transition);
}

.event-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.event-category, .event-status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: capitalize;
}

.event-category.worship { background: #e0e7ff; color: #4338ca; }
.event-category.prayer { background: #fce7f3; color: #be185d; }
.event-category.bible-study { background: #dbeafe; color: #1e40af; }
.event-category.conference { background: #dcfce7; color: #16a34a; }
.event-category.fellowship { background: #fef3c7; color: #d97706; }

.event-status.upcoming { background: #dbeafe; color: #0369a1; }
.event-status.active { background: #d1fae5; color: var(--success); }

.event-card h3 {
    font-size: 1.25rem;
    color: var(--text-dark);
    margin-bottom: 0.75rem;
}

.event-description {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.event-details {
    margin-bottom: 1rem;
}

.event-detail {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-light);
    font-size: 0.9rem;
}

.event-detail i {
    color: var(--primary);
    width: 16px;
}

.event-actions {
    display: flex;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.event-actions button {
    flex: 1;
}

.upcoming-events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.view-toggle {
    display: flex;
    gap: 0.5rem;
}

.view-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-white);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-light);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.view-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.view-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--bg-white);
}

.calendar-container {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 2rem;
    margin-bottom: 2rem;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.calendar-nav {
    background: none;
    border: none;
    color: var(--primary);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    transition: var(--transition);
}

.calendar-nav:hover {
    color: var(--primary-dark);
}

.event-list-item {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    margin-bottom: 1rem;
    transition: var(--transition);
}

.event-list-item:hover {
    box-shadow: var(--shadow-md);
}

.event-date-badge {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    color: var(--bg-white);
    padding: 1rem;
    border-radius: var(--radius-md);
    text-align: center;
    min-width: 70px;
}

.date-day {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;
}

.date-month {
    font-size: 0.9rem;
    text-transform: uppercase;
    margin-top: 0.25rem;
}

.event-list-details {
    flex: 1;
}

.event-list-details h4 {
    font-size: 1.1rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.event-list-details p {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
}

.event-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.event-meta span {
    color: var(--text-light);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.event-list-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .upcoming-events-grid {
        grid-template-columns: 1fr;
    }
    
    .event-list-item {
        flex-direction: column;
        text-align: center;
    }
    
    .event-list-actions {
        flex-direction: row;
        width: 100%;
    }
    
    .event-list-actions button {
        flex: 1;
    }
}
</style>
`;

if (!document.getElementById('admin-events-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'admin-events-styles';
    styleElement.innerHTML = eventCardStyles;
    document.head.appendChild(styleElement);
}
