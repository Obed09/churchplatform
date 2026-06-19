/* ============================================ */
/* MINISTRIES COMPONENT SYSTEM */
/* Edit the ministriesData array below to update ministry leaders */
/* ============================================ */

// ============================================
// PASTE YOUR REAL MINISTRY LEADERS IN THIS ARRAY
// Just copy this format and update the values
// ============================================
const ministriesData = [
    {
        name: "Children's Ministry",
        leader: "Emily Rodriguez",
        icon: "fa-child",
        description: "Nurturing young hearts to know and love Jesus through engaging lessons and activities.",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80"
    },
    {
        name: "Youth Ministry",
        leader: "David Thompson",
        icon: "fa-users",
        description: "Empowering teens to grow in faith, build authentic friendships, and impact their world.",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80"
    },
    {
        name: "Worship Ministry",
        leader: "Rachel Martinez",
        icon: "fa-music",
        description: "Leading God's people in spirit-filled worship that honors Him and transforms lives.",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80"
    },
    {
        name: "Prayer Ministry",
        leader: "James Wilson",
        icon: "fa-praying-hands",
        description: "Interceding for our church family and community, believing God answers prayer.",
        image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80"
    },
    {
        name: "Outreach Ministry",
        leader: "Maria Garcia",
        icon: "fa-hands-helping",
        description: "Serving our community with the love of Christ through practical acts of kindness.",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80"
    },
    {
        name: "Men's Ministry",
        leader: "Robert Anderson",
        icon: "fa-male",
        description: "Building godly men through fellowship, accountability, and biblical teaching.",
        image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80"
    },
    {
        name: "Women's Ministry",
        leader: "Jennifer Lee",
        icon: "fa-female",
        description: "Creating a space for women to grow spiritually and support one another in life's journey.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
    },
    {
        name: "Seniors Ministry",
        leader: "Dorothy Miller",
        icon: "fa-heart",
        description: "Honoring and caring for our senior saints through fellowship and meaningful connections.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
    }
];

// ============================================
// AUTOMATIC RENDERING - NO NEED TO EDIT BELOW
// ============================================
function renderMinistries() {
    const ministriesGrid = document.getElementById('ministriesGrid');
    
    if (!ministriesGrid) return;
    
    ministriesGrid.innerHTML = ministriesData.map(ministry => `
        <div class="ministry-card">
            <img src="${ministry.image}" alt="${ministry.name}" class="ministry-image">
            <div class="ministry-content">
                <div class="ministry-icon">
                    <i class="fas ${ministry.icon}"></i>
                </div>
                <h3 class="ministry-title">${ministry.name}</h3>
                <p class="ministry-leader">Led by ${ministry.leader}</p>
                <p class="ministry-description">${ministry.description}</p>
            </div>
        </div>
    `).join('');
}

// Render ministries when page loads
document.addEventListener('DOMContentLoaded', renderMinistries);
