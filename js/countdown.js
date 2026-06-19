/* ============================================ */
/* COUNTDOWN TIMER */
/* Easy to edit - just change the target date below */
/* ============================================ */

// ============================================
// EDIT THIS DATE FOR YOUR EVENT
// Format: 'Month Day, Year HH:MM:SS'
// Example: 'December 25, 2024 10:00:00'
// ============================================
const targetDate = new Date('June 12, 2026 09:00:00').getTime();

// Update countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);

function updateCountdown() {
    // Get current time
    const now = new Date().getTime();
    
    // Calculate time difference
    const distance = targetDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the result in the elements
    document.getElementById('days').textContent = padZero(days);
    document.getElementById('hours').textContent = padZero(hours);
    document.getElementById('minutes').textContent = padZero(minutes);
    document.getElementById('seconds').textContent = padZero(seconds);
    
    // If the countdown is finished, display a message
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = `
            <div style="font-size: 2rem; font-weight: 700; color: var(--accent-color);">
                🎉 The Event Has Arrived! 🎉
            </div>
        `;
    }
}

// Add leading zero to single digits
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Run immediately on page load
updateCountdown();
