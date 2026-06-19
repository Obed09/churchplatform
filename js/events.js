/* ============================================ */
/* EVENTS COMPONENT SYSTEM */
/* Edit the eventsData array below to update events */
/* ============================================ */

// ============================================
// PASTE YOUR REAL EVENTS IN THIS ARRAY
// Just copy this format and update the values
// ============================================
const eventsData = [
    {
        title: "3 Days of Intimacy with God",
        date: "2026-06-12", // Format: YYYY-MM-DD
        time: "June 12-14, 2026",
        location: "Main Sanctuary",
        description: "Join us for three powerful days of seeking God's presence. Experience deeper intimacy with the Father through worship, prayer, and fasting. Let God draw you closer in this sacred time of spiritual renewal.",
        registrationUrl: "#" // Add registration link here
    },
    {
        title: "40 Days of Prayer: God is Our Guide and Provider",
        date: "2026-06-17",
        time: "June 17 - July 26, 2026",
        location: "Church & Online",
        description: "Embark on a 40-day journey of prayer and faith. Trust God as our ultimate guide and provider. Daily prayer prompts, Scripture readings, and testimonies to strengthen your walk with Christ.",
        registrationUrl: "#"
    }
];

// ============================================
// AUTOMATIC RENDERING - NO NEED TO EDIT BELOW
// ============================================
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    
    if (!eventsGrid) return;
    
    eventsGrid.innerHTML = eventsData.map(event => {
        const eventDate = new Date(event.date);
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[eventDate.getMonth()];
        const day = eventDate.getDate();
        
        return `
            <div class="event-card">
                <div class="event-date-badge">
                    <span class="event-month">${month}</span>
                    <span class="event-day">${day}</span>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-meta">
                        <span class="event-meta-item">
                            <i class="fas fa-clock"></i>
                            ${event.time}
                        </span>
                        <span class="event-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${event.location}
                        </span>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <a href="${event.registrationUrl}" class="event-btn">
                        <i class="fas fa-ticket-alt"></i> Register Now
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// Render events when page loads
document.addEventListener('DOMContentLoaded', renderEvents);
