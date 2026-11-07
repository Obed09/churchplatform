// ============================================
// EVENTS MANAGEMENT
// Records stay in this browser so Create, Edit, and Delete
// change the events already shown on this page.
// ============================================

const EVENTS_STORAGE_KEY = 'churchEventsLedger';

const SEED_EVENTS = [
    {
        id: 'evt-1',
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
        notes: '',
        status: 'upcoming'
    },
    {
        id: 'evt-2',
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
        notes: '',
        status: 'upcoming'
    }
];

let visibleMonth = new Date(2026, 5, 1);

document.addEventListener('DOMContentLoaded', function() {
    renderAllEvents();
    initializeEventForm();
});

function loadEvents() {
    try {
        const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
        if (raw === null || raw === '') {
            return SEED_EVENTS.map(event => ({ ...event }));
        }
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) return saved;
    } catch (error) {
        console.error('Could not read events:', error);
    }
    return SEED_EVENTS.map(event => ({ ...event }));
}

function saveEvents(events) {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
}

function renderAllEvents() {
    const events = loadEvents();
    renderStats(events);
    renderUpcomingEvents(events);
    renderEventsList(events);
    renderCalendar(events);
}

function renderStats(events) {
    const upcoming = events.filter(event => event.status === 'upcoming')
        .sort((a, b) => a.startDate.localeCompare(b.startDate));
    setText('upcomingEvents', upcoming.length);
    setText('totalRegistrations', events.reduce((sum, event) => sum + Number(event.registered || 0), 0));
    setText('activeEvents', events.filter(event => event.status === 'active').length);
    setText('completedEvents', events.filter(event => event.status === 'completed').length);
    const next = document.getElementById('nextEventDate');
    if (next) {
        next.textContent = upcoming.length
            ? 'Next: ' + formatMonthDay(upcoming[0].startDate)
            : 'None scheduled';
    }
}

function renderUpcomingEvents(events) {
    const container = document.getElementById('upcomingEventsGrid');
    if (!container) return;
    const upcoming = events
        .filter(event => event.status === 'upcoming' || event.status === 'active')
        .sort((a, b) => a.startDate.localeCompare(b.startDate));

    if (!upcoming.length) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:#718096;"><p>No upcoming events. Click "Create Event" to add one.</p></div>';
        return;
    }

    container.innerHTML = upcoming.map(event => `
        <div class="event-card">
            <div class="event-header">
                <span class="event-category ${escapeHtml(event.category)}">${escapeHtml(categoryName(event.category))}</span>
                <span class="event-status ${escapeHtml(event.status)}">${escapeHtml(event.status)}</span>
            </div>
            <h3>${escapeHtml(event.title)}</h3>
            <p class="event-description">${escapeHtml(event.description)}</p>
            <div class="event-details">
                <div class="event-detail"><i class="fas fa-calendar"></i><span>${escapeHtml(formatEventDate(event.startDate, event.endDate))}</span></div>
                <div class="event-detail"><i class="fas fa-clock"></i><span>${escapeHtml(formatEventTime(event.startDate))}</span></div>
                <div class="event-detail"><i class="fas fa-map-marker-alt"></i><span>${escapeHtml(event.location)}</span></div>
                <div class="event-detail"><i class="fas fa-user"></i><span>${escapeHtml(event.coordinator)}</span></div>
                <div class="event-detail"><i class="fas fa-users"></i><span>${escapeHtml(registrationLabel(event))}</span></div>
            </div>
            <div class="event-actions">
                <button type="button" class="btn-secondary" onclick="viewEvent('${event.id}')"><i class="fas fa-eye"></i> View Details</button>
                <button type="button" class="btn-primary" onclick="manageRegistrations('${event.id}')"><i class="fas fa-users"></i> Registrations</button>
            </div>
        </div>
    `).join('');
}

function renderEventsList(events) {
    const container = document.getElementById('eventsListContainer');
    if (!container) return;
    const source = events || loadEvents();
    const filter = document.getElementById('eventFilter')?.value || 'all';
    const visible = filter === 'all' ? source : source.filter(event => event.status === filter);

    if (!visible.length) {
        container.innerHTML = '<p style="color:#718096;padding:1rem;">No events in this list.</p>';
        return;
    }

    container.innerHTML = visible.map(event => {
        const start = new Date(event.startDate);
        return `
            <div class="event-list-item">
                <div class="event-date-badge">
                    <div class="date-day">${start.getDate()}</div>
                    <div class="date-month">${start.toLocaleString('en-US', { month: 'short' })}</div>
                </div>
                <div class="event-list-details">
                    <h4>${escapeHtml(event.title)}</h4>
                    <p>${escapeHtml(event.description)}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-clock"></i> ${escapeHtml(formatEventTime(event.startDate))}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location)}</span>
                        <span><i class="fas fa-users"></i> ${escapeHtml(registrationLabel(event))}</span>
                    </div>
                </div>
                <div class="event-list-actions">
                    <button type="button" class="btn-secondary" onclick="editEvent('${event.id}')">Edit</button>
                    <button type="button" class="btn-primary" onclick="viewEvent('${event.id}')">View</button>
                    <button type="button" class="btn-secondary" onclick="deleteEventRecord('${event.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderCalendar(events) {
    const grid = document.getElementById('calendarGrid');
    const label = document.getElementById('currentMonth');
    if (!grid || !label) return;

    const source = events || loadEvents();
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    label.textContent = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        .map(day => `<div>${day}</div>`).join('');

    let days = '';
    for (let blank = 0; blank < firstWeekday; blank++) {
        days += '<div class="calendar-day is-empty"></div>';
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEvents = source.filter(event => eventCoversDay(event, date));
        days += `
            <div class="calendar-day">
                <button type="button" class="calendar-day-number" onclick="createEventOnDay(${year}, ${month}, ${day})">${day}</button>
                ${dayEvents.map(event => `<button type="button" class="calendar-event" onclick="viewEvent('${event.id}')">${escapeHtml(event.title)}</button>`).join('')}
            </div>
        `;
    }

    grid.innerHTML = `<div class="calendar-weekdays">${weekdays}</div><div class="calendar-days">${days}</div>`;
}

function initializeEventForm() {
    const form = document.getElementById('eventForm');
    if (!form) return;

    form.addEventListener('submit', function(submitEvent) {
        submitEvent.preventDefault();
        const startDate = document.getElementById('eventStartDate').value;
        const endDate = document.getElementById('eventEndDate').value;
        if (endDate < startDate) {
            showNotification('The end date must be on or after the start date.', 'error');
            return;
        }

        const events = loadEvents();
        const editId = form.dataset.editId || '';
        const existing = events.find(event => event.id === editId);
        const capacityValue = document.getElementById('eventCapacity').value;
        const record = {
            id: editId || createId(),
            title: document.getElementById('eventTitle').value.trim(),
            description: document.getElementById('eventDescription').value.trim(),
            startDate: startDate,
            endDate: endDate,
            location: document.getElementById('eventLocation').value.trim(),
            category: document.getElementById('eventCategory').value,
            coordinator: document.getElementById('eventCoordinator').value.trim(),
            capacity: capacityValue === '' ? null : Number(capacityValue),
            registered: existing ? Number(existing.registered || 0) : 0,
            requiresRegistration: document.getElementById('eventRequiresRegistration').checked,
            notes: document.getElementById('eventNotes').value.trim(),
            status: existing ? existing.status : statusForDates(startDate, endDate)
        };

        const next = existing
            ? events.map(event => event.id === record.id ? record : event)
            : events.concat(record);
        saveEvents(next);
        delete form.dataset.editId;
        closeModal('eventModal');
        renderAllEvents();
        showNotification(existing ? 'Event updated.' : 'Event created.', 'success');
    });
}

function openCreateEventModal() {
    const form = document.getElementById('eventForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }
    const title = document.getElementById('eventModalTitle');
    const button = document.getElementById('eventSubmitBtn');
    if (title) title.innerHTML = '<i class="fas fa-calendar-plus"></i> Create New Event';
    if (button) button.innerHTML = '<i class="fas fa-save"></i> Create Event';
    openModal('eventModal');
}

function createEventOnDay(year, month, day) {
    openCreateEventModal();
    const stamp = pad(year) + '-' + pad(month + 1) + '-' + pad(day);
    const start = document.getElementById('eventStartDate');
    const end = document.getElementById('eventEndDate');
    if (start) start.value = stamp + 'T09:00';
    if (end) end.value = stamp + 'T12:00';
}

function editEvent(id) {
    const event = loadEvents().find(item => item.id === id);
    if (!event) return;
    openCreateEventModal();
    const form = document.getElementById('eventForm');
    form.dataset.editId = event.id;
    document.getElementById('eventModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Event';
    document.getElementById('eventSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Save Changes';
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventStartDate').value = toDateTimeInput(event.startDate);
    document.getElementById('eventEndDate').value = toDateTimeInput(event.endDate);
    document.getElementById('eventLocation').value = event.location || '';
    document.getElementById('eventCategory').value = event.category || '';
    document.getElementById('eventCapacity').value = event.capacity == null ? '' : event.capacity;
    document.getElementById('eventRequiresRegistration').checked = Boolean(event.requiresRegistration);
    document.getElementById('eventCoordinator').value = event.coordinator || '';
    document.getElementById('eventNotes').value = event.notes || '';
}

function viewEvent(id) {
    const event = loadEvents().find(item => item.id === id);
    if (!event) return;
    alert([
        event.title,
        '',
        'Date: ' + formatEventDate(event.startDate, event.endDate),
        'Time: ' + formatEventTime(event.startDate),
        'Location: ' + event.location,
        'Category: ' + categoryName(event.category),
        'Coordinator: ' + event.coordinator,
        'Status: ' + event.status,
        'Registrations: ' + registrationLabel(event),
        '',
        event.description,
        event.notes ? '\nNotes: ' + event.notes : ''
    ].join('\n'));
}

function manageRegistrations(id) {
    const events = loadEvents();
    const event = events.find(item => item.id === id);
    if (!event) return;
    const entered = prompt(
        'Registrations for ' + event.title + '\nCurrently ' + registrationLabel(event) + '.\n\nEnter the new registration count:',
        String(event.registered || 0)
    );
    if (entered === null) return;
    const count = Number(entered);
    if (!Number.isInteger(count) || count < 0) {
        showNotification('Enter a whole number of registrations.', 'error');
        return;
    }
    if (event.capacity && count > Number(event.capacity)) {
        showNotification('That count is over the event capacity of ' + event.capacity + '.', 'error');
        return;
    }
    event.registered = count;
    saveEvents(events);
    renderAllEvents();
    showNotification('Registrations updated.', 'success');
}

function deleteEventRecord(id) {
    const event = loadEvents().find(item => item.id === id);
    if (!event) return;
    if (!confirm('Delete "' + event.title + '"?')) return;
    saveEvents(loadEvents().filter(item => item.id !== id));
    renderAllEvents();
    showNotification('Event deleted.', 'success');
}

function filterEvents() {
    renderEventsList();
}

function switchView(view, button) {
    const calendarView = document.getElementById('calendar-view');
    const listView = document.getElementById('list-view');
    document.querySelectorAll('.view-btn').forEach(item => item.classList.remove('active'));
    if (button) button.classList.add('active');
    if (view === 'calendar') {
        calendarView.style.display = 'block';
        listView.style.display = 'none';
        renderCalendar();
    } else {
        calendarView.style.display = 'none';
        listView.style.display = 'block';
        renderEventsList();
    }
}

function previousMonth() {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
}

function nextMonth() {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
}

function eventCoversDay(event, date) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    return start <= dayEnd && end >= dayStart;
}

function statusForDates(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < now) return 'completed';
    if (start <= now && now <= end) return 'active';
    return 'upcoming';
}

function registrationLabel(event) {
    if (event.capacity) return event.registered + ' / ' + event.capacity + ' registered';
    return event.registered + ' registered';
}

function categoryName(value) {
    const names = {
        worship: 'Worship',
        prayer: 'Prayer',
        'bible-study': 'Bible Study',
        outreach: 'Outreach',
        fellowship: 'Fellowship',
        conference: 'Conference',
        other: 'Other'
    };
    return names[value] || value || 'Event';
}

function formatEventDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.toDateString() === end.toDateString()) return formatMonthDay(startDate);
    return formatMonthDay(startDate) + ' - ' + formatMonthDay(endDate);
}

function formatMonthDay(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function formatEventTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function toDateTimeInput(value) {
    return String(value || '').slice(0, 16);
}

function pad(number) {
    return String(number).padStart(2, '0');
}

function createId() {
    return 'evt-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

window.openCreateEventModal = openCreateEventModal;
window.createEventOnDay = createEventOnDay;
window.editEvent = editEvent;
window.viewEvent = viewEvent;
window.manageRegistrations = manageRegistrations;
window.deleteEventRecord = deleteEventRecord;
window.filterEvents = filterEvents;
window.switchView = switchView;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;

if (!document.getElementById('admin-events-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'admin-events-styles';
    styleElement.textContent = `
.event-card { background: var(--bg-white); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: 1.5rem; transition: var(--transition); }
.event-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.event-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.event-category, .event-status { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600; text-transform: capitalize; }
.event-category.worship { background: #e0e7ff; color: #4338ca; }
.event-category.prayer { background: #fce7f3; color: #be185d; }
.event-category.bible-study { background: #dbeafe; color: #1e40af; }
.event-category.conference { background: #dcfce7; color: #16a34a; }
.event-category.fellowship { background: #fef3c7; color: #d97706; }
.event-category.outreach { background: #e0f2fe; color: #0369a1; }
.event-category.other { background: #edf2f7; color: #4a5568; }
.event-status.upcoming { background: #dbeafe; color: #0369a1; }
.event-status.active { background: #d1fae5; color: var(--success); }
.event-status.completed { background: #edf2f7; color: #4a5568; }
.event-status.cancelled { background: #fee2e2; color: #b91c1c; }
.event-card h3 { font-size: 1.25rem; color: var(--text-dark); margin-bottom: 0.75rem; }
.event-description { color: var(--text-light); line-height: 1.6; margin-bottom: 1rem; }
.event-details { margin-bottom: 1rem; }
.event-detail { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: var(--text-light); font-size: 0.9rem; }
.event-detail i { color: var(--primary); width: 16px; }
.event-actions { display: flex; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #e2e8f0); }
.event-actions button { flex: 1; }
.upcoming-events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
.view-toggle { display: flex; gap: 0.5rem; }
.view-btn { padding: 0.5rem 1rem; background: var(--bg-white); border: 2px solid var(--border-color, #e2e8f0); border-radius: var(--radius-md); color: var(--text-light); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.view-btn.active { background: var(--primary); border-color: var(--primary); color: white; }
.calendar-container { background: var(--bg-white); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: 2rem; margin-bottom: 2rem; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.calendar-nav { background: none; border: none; color: var(--primary); font-size: 1.25rem; cursor: pointer; padding: 0.5rem; }
.calendar-weekdays, .calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.35rem; }
.calendar-weekdays div { text-align: center; font-size: 0.8rem; font-weight: 700; color: var(--text-light); }
.calendar-day { min-height: 88px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.35rem; background: #fff; }
.calendar-day.is-empty { background: transparent; border-color: transparent; }
.calendar-day-number { background: none; border: none; color: var(--text-dark); font-weight: 700; cursor: pointer; padding: 0; }
.calendar-event { display: block; width: 100%; margin-top: 0.25rem; border: none; border-radius: 6px; background: #dbeafe; color: #1e3a8a; font-size: 0.72rem; text-align: left; padding: 0.2rem 0.35rem; cursor: pointer; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.event-list-item { background: var(--bg-white); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: 1.5rem; display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem; }
.event-date-badge { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: white; padding: 1rem; border-radius: var(--radius-md); text-align: center; min-width: 70px; }
.date-day { font-size: 1.75rem; font-weight: 700; line-height: 1; }
.date-month { font-size: 0.9rem; text-transform: uppercase; margin-top: 0.25rem; }
.event-list-details { flex: 1; }
.event-list-details h4 { font-size: 1.1rem; color: var(--text-dark); margin-bottom: 0.5rem; }
.event-list-details p { color: var(--text-light); font-size: 0.9rem; margin-bottom: 0.75rem; }
.event-meta { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.event-meta span { color: var(--text-light); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
.event-list-actions { display: flex; flex-direction: column; gap: 0.5rem; }
@media (max-width: 768px) {
    .upcoming-events-grid { grid-template-columns: 1fr; }
    .event-list-item { flex-direction: column; text-align: center; }
    .calendar-day { min-height: 64px; }
}
`;
    document.head.appendChild(styleElement);
}
