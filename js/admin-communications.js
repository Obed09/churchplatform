// ============================================
// COMMUNICATIONS DEPARTMENT
// ============================================

// Sample messages data
const sampleMessages = [
    {
        id: 1,
        subject: 'Welcome to June - Monthly Newsletter',
        recipients: 'All Members',
        type: 'email',
        date: '2026-06-01',
        status: 'sent',
        openRate: 78
    },
    {
        id: 2,
        subject: 'Reminder: 3 Days of Intimacy Event',
        recipients: 'Active Members',
        type: 'both',
        date: '2026-06-07',
        status: 'sent',
        openRate: 92
    },
    {
        id: 3,
        subject: 'Prayer Meeting Schedule Update',
        recipients: 'Ministry Leaders',
        type: 'email',
        date: '2026-06-05',
        status: 'sent',
        openRate: 85
    }
];

// Sample announcements
const sampleAnnouncements = [
    {
        id: 1,
        title: '3 Days of Intimacy with God - Starting June 12',
        content: 'Join us for a powerful three-day spiritual retreat. Registration is now open!',
        startDate: '2026-06-07',
        endDate: '2026-06-14',
        priority: 'high',
        status: 'active'
    },
    {
        id: 2,
        title: 'New Sunday Service Time',
        content: 'Starting next month, our main Sunday service will begin at 9:00 AM instead of 9:30 AM.',
        startDate: '2026-06-01',
        endDate: '2026-06-30',
        priority: 'normal',
        status: 'active'
    }
];

// Sample templates
const messageTemplates = [
    {
        id: 1,
        name: 'Event Reminder',
        category: 'Events',
        lastUsed: '2026-06-07'
    },
    {
        id: 2,
        name: 'Welcome New Member',
        category: 'Membership',
        lastUsed: '2026-06-05'
    },
    {
        id: 3,
        name: 'Weekly Newsletter',
        category: 'Newsletter',
        lastUsed: '2026-06-01'
    },
    {
        id: 4,
        name: 'Prayer Request',
        category: 'Prayer',
        lastUsed: '2026-05-28'
    }
];

// Initialize communications page
document.addEventListener('DOMContentLoaded', function() {
    loadCommunicationsStats();
    renderMessagesList();
    renderAnnouncementsGrid();
    renderTemplatesGrid();
    initializeMessageForm();
    initializeAnnouncementForm();
});

// Load statistics
function loadCommunicationsStats() {
    const messagesSent = sampleMessages.length;
    const avgOpenRate = Math.round(sampleMessages.reduce((sum, m) => sum + m.openRate, 0) / sampleMessages.length);
    const subscribers = 324; // Total active members
    const activeAnnouncements = sampleAnnouncements.filter(a => a.status === 'active').length;
    
    document.getElementById('messagesSent').textContent = messagesSent;
    document.getElementById('openRate').textContent = `${avgOpenRate}%`;
    document.getElementById('subscribers').textContent = subscribers;
    document.getElementById('announcements').textContent = activeAnnouncements;
}

// Render messages list
function renderMessagesList() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    
    container.innerHTML = sampleMessages.map(message => `
        <div class="message-item">
            <div class="message-icon">
                <i class="fas fa-${message.type === 'email' ? 'envelope' : message.type === 'sms' ? 'sms' : 'paper-plane'}"></i>
            </div>
            <div class="message-details">
                <h4>${message.subject}</h4>
                <p class="message-meta">
                    <span><i class="fas fa-users"></i> ${message.recipients}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(message.date)}</span>
                    <span><i class="fas fa-envelope-open"></i> ${message.openRate}% open rate</span>
                </p>
            </div>
            <div class="message-status">
                <span class="badge badge-${message.status === 'sent' ? 'success' : 'info'}">${message.status}</span>
            </div>
            <div class="message-actions">
                <button class="action-btn" onclick="viewMessage(${message.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="duplicateMessage(${message.id})">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Render announcements grid
function renderAnnouncementsGrid() {
    const container = document.getElementById('announcementsGrid');
    if (!container) return;
    
    container.innerHTML = sampleAnnouncements.map(announcement => `
        <div class="announcement-card priority-${announcement.priority}">
            <div class="announcement-header">
                <span class="priority-badge ${announcement.priority}">${announcement.priority}</span>
                <span class="status-badge ${announcement.status}">${announcement.status}</span>
            </div>
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
            <div class="announcement-dates">
                <span><i class="fas fa-calendar-start"></i> ${formatDate(announcement.startDate)}</span>
                <span><i class="fas fa-calendar-end"></i> ${formatDate(announcement.endDate)}</span>
            </div>
            <div class="announcement-actions">
                <button class="btn-secondary" onclick="editAnnouncement(${announcement.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete" onclick="deleteAnnouncement(${announcement.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Render templates grid
function renderTemplatesGrid() {
    const container = document.getElementById('templatesGrid');
    if (!container) return;
    
    container.innerHTML = messageTemplates.map(template => `
        <div class="template-card">
            <div class="template-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <h3>${template.name}</h3>
            <p class="template-category">${template.category}</p>
            <p class="template-meta">Last used: ${formatDate(template.lastUsed)}</p>
            <div class="template-actions">
                <button class="btn-secondary" onclick="useTemplate(${template.id})">
                    <i class="fas fa-paper-plane"></i> Use Template
                </button>
                <button class="action-btn" onclick="editTemplate(${template.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteTemplate(${template.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize message form
function initializeMessageForm() {
    const form = document.getElementById('messageForm');
    if (!form) return;
    
    // Schedule checkbox toggle
    const scheduleCheckbox = document.getElementById('messageSchedule');
    const scheduleGroup = document.getElementById('scheduleGroup');
    
    if (scheduleCheckbox && scheduleGroup) {
        scheduleCheckbox.addEventListener('change', function() {
            scheduleGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newMessage = {
            recipients: Array.from(document.getElementById('messageRecipients').selectedOptions).map(o => o.text),
            subject: document.getElementById('messageSubject').value,
            type: document.getElementById('messageType').value,
            body: document.getElementById('messageBody').value,
            scheduled: document.getElementById('messageSchedule').checked,
            scheduleDate: document.getElementById('messageScheduleDate').value
        };
        
        console.log('New message:', newMessage);
        
        const action = newMessage.scheduled ? 'scheduled' : 'sent';
        alert(`Message ${action} successfully!\n\nSubject: ${newMessage.subject}\nRecipients: ${newMessage.recipients.join(', ')}\nType: ${newMessage.type}`);
        
        closeModal('messageModal');
        form.reset();
        
        renderMessagesList();
        loadCommunicationsStats();
    });
}

// Initialize announcement form
function initializeAnnouncementForm() {
    const form = document.getElementById('announcementForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newAnnouncement = {
            title: document.getElementById('announcementTitle').value,
            content: document.getElementById('announcementContent').value,
            startDate: document.getElementById('announcementStartDate').value,
            endDate: document.getElementById('announcementEndDate').value,
            priority: document.getElementById('announcementPriority').value
        };
        
        console.log('New announcement:', newAnnouncement);
        
        alert(`Announcement published!\n\nTitle: ${newAnnouncement.title}\nPriority: ${newAnnouncement.priority}\nDisplay: ${formatDate(newAnnouncement.startDate)} - ${formatDate(newAnnouncement.endDate)}`);
        
        closeModal('announcementModal');
        form.reset();
        
        renderAnnouncementsGrid();
        loadCommunicationsStats();
    });
}

// Filter functions
function filterMessages() {
    const filter = document.getElementById('messageFilter').value;
    console.log('Filtering messages by:', filter);
    renderMessagesList();
}

// Action functions
function viewMessage(id) {
    const message = sampleMessages.find(m => m.id === id);
    if (message) {
        alert(`Message Details:\n\nSubject: ${message.subject}\nRecipients: ${message.recipients}\nType: ${message.type}\nDate: ${formatDate(message.date)}\nStatus: ${message.status}\nOpen Rate: ${message.openRate}%`);
    }
}

function duplicateMessage(id) {
    alert(`Duplicating message ${id}\n\nThis will create a copy with the same content.`);
}

function saveAsDraft() {
    alert('Message saved as draft!\n\nYou can edit and send it later.');
}

function editAnnouncement(id) {
    alert(`Edit announcement ${id}\n\nThis will open the edit form.`);
}

function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        alert('Announcement deleted successfully!');
        renderAnnouncementsGrid();
        loadCommunicationsStats();
    }
}

function useTemplate(id) {
    const template = messageTemplates.find(t => t.id === id);
    if (template) {
        alert(`Using template: ${template.name}\n\nThis will open the message form with template content.`);
        openModal('messageModal');
    }
}

function editTemplate(id) {
    alert(`Edit template ${id}\n\nThis will open the template editor.`);
}

function deleteTemplate(id) {
    if (confirm('Are you sure you want to delete this template?')) {
        alert('Template deleted successfully!');
        renderTemplatesGrid();
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add communications styles
const communicationsStyles = `
<style>
.messages-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.message-item {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    transition: var(--transition);
}

.message-item:hover {
    box-shadow: var(--shadow-md);
}

.message-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bg-white);
    font-size: 1.25rem;
    flex-shrink: 0;
}

.message-details {
    flex: 1;
}

.message-details h4 {
    font-size: 1.1rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.message-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.message-meta span {
    color: var(--text-light);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.message-status {
    flex-shrink: 0;
}

.message-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
}

.announcements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.announcement-card {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    border-left: 4px solid var(--primary);
    transition: var(--transition);
}

.announcement-card.priority-high {
    border-left-color: var(--danger);
}

.announcement-card.priority-urgent {
    border-left-color: #dc2626;
    background: #fef2f2;
}

.announcement-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.announcement-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.priority-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.priority-badge.normal {
    background: #dbeafe;
    color: #0369a1;
}

.priority-badge.high {
    background: #fef3c7;
    color: #d97706;
}

.priority-badge.urgent {
    background: #fee2e2;
    color: #dc2626;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-badge.active {
    background: #d1fae5;
    color: var(--success);
}

.announcement-card h3 {
    font-size: 1.1rem;
    color: var(--text-dark);
    margin-bottom: 0.75rem;
}

.announcement-card p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.announcement-dates {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.announcement-dates span {
    color: var(--text-light);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.announcement-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.announcement-actions .btn-secondary {
    flex: 1;
}

.templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.template-card {
    background: var(--bg-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    text-align: center;
    transition: var(--transition);
}

.template-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.template-icon {
    width: 60px;
    height: 60px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bg-white);
    font-size: 1.5rem;
    margin: 0 auto 1rem;
}

.template-card h3 {
    font-size: 1.1rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
}

.template-category {
    color: var(--primary);
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.template-meta {
    color: var(--text-light);
    font-size: 0.85rem;
    margin-bottom: 1rem;
}

.template-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.template-actions .btn-secondary {
    width: 100%;
    justify-content: center;
}

.template-actions .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.newsletter-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (max-width: 768px) {
    .message-item {
        flex-direction: column;
        text-align: center;
    }
    
    .message-meta {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .announcements-grid,
    .templates-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

if (!document.getElementById('admin-communications-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'admin-communications-styles';
    styleElement.innerHTML = communicationsStyles;
    document.head.appendChild(styleElement);
}
