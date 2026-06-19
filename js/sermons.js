/* ============================================ */
/* SERMONS COMPONENT SYSTEM */
/* Edit the sermonsData array below to update sermons */
/* ============================================ */

// ============================================
// PASTE YOUR REAL SERMONS IN THIS ARRAY
// Just copy this format and update the values
// ============================================
const sermonsData = [
    {
        title: "Walking in Faith",
        speaker: "Pastor John Smith",
        date: "December 15, 2024",
        description: "Discover how to strengthen your faith journey and trust God in every season of life.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        audioUrl: "#", // Add your audio file URL here
        videoUrl: "#"  // Add your video URL here
    },
    {
        title: "The Power of Prayer",
        speaker: "Pastor Sarah Johnson",
        date: "December 8, 2024",
        description: "Learn how prayer transforms our lives and deepens our relationship with God.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
        audioUrl: "#",
        videoUrl: "#"
    },
    {
        title: "Love Your Neighbor",
        speaker: "Pastor John Smith",
        date: "December 1, 2024",
        description: "Understanding Christ's command to love others and serve our community with compassion.",
        image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80",
        audioUrl: "#",
        videoUrl: "#"
    },
    {
        title: "Finding Hope in Hard Times",
        speaker: "Pastor Sarah Johnson",
        date: "November 24, 2024",
        description: "When life feels overwhelming, discover where true hope and strength can be found.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&q=80",
        audioUrl: "#",
        videoUrl: "#"
    },
    {
        title: "Grace and Forgiveness",
        speaker: "Pastor Michael Brown",
        date: "November 17, 2024",
        description: "Exploring the transformative power of God's grace and the freedom found in forgiveness.",
        image: "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=400&q=80",
        audioUrl: "#",
        videoUrl: "#"
    },
    {
        title: "Building Your Spiritual Foundation",
        speaker: "Pastor John Smith",
        date: "November 10, 2024",
        description: "Essential principles for establishing a strong and lasting relationship with Christ.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        audioUrl: "#",
        videoUrl: "#"
    }
];

// ============================================
// AUTOMATIC RENDERING - NO NEED TO EDIT BELOW
// ============================================
function renderSermons() {
    const sermonsGrid = document.getElementById('sermonsGrid');
    
    if (!sermonsGrid) return;
    
    sermonsGrid.innerHTML = sermonsData.map(sermon => `
        <div class="sermon-card">
            <img src="${sermon.image}" alt="${sermon.title}" class="sermon-image">
            <div class="sermon-content">
                <span class="sermon-date">${sermon.date}</span>
                <h3 class="sermon-title">${sermon.title}</h3>
                <p class="sermon-speaker">By ${sermon.speaker}</p>
                <p class="sermon-description">${sermon.description}</p>
                <div class="sermon-actions">
                    <a href="${sermon.audioUrl}" class="sermon-btn sermon-btn-primary">
                        <i class="fas fa-headphones"></i> Listen
                    </a>
                    <a href="${sermon.videoUrl}" class="sermon-btn sermon-btn-secondary">
                        <i class="fas fa-video"></i> Watch
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Render sermons when page loads
document.addEventListener('DOMContentLoaded', renderSermons);
