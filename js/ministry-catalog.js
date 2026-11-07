// Shared ministry list for the public website and the back office.
// The same browser keeps edits so the Ministries section can change
// without editing the page by hand.

const MINISTRY_STORAGE_KEY = 'churchMinistriesLedger';

const WEBSITE_MINISTRIES = [
    {
        id: 'min-children',
        name: "Children's Ministry",
        leader: 'Emily Rodriguez',
        description: 'Nurturing young hearts to know and love Jesus through engaging lessons and activities.',
        icon: 'fa-child',
        image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
        category: 'children',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    },
    {
        id: 'min-youth',
        name: 'Youth Ministry',
        leader: 'David Thompson',
        description: 'Empowering teens to grow in faith, build authentic friendships, and impact their world.',
        icon: 'fa-users',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
        category: 'youth',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    },
    {
        id: 'min-worship',
        name: 'Worship Ministry',
        leader: 'Rachel Martinez',
        description: 'Leading God\'s people in spirit-filled worship that honors Him and transforms lives.',
        icon: 'fa-music',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80',
        category: 'worship',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    },
    {
        id: 'min-prayer',
        name: 'Prayer Ministry',
        leader: 'James Wilson',
        description: 'Interceding for our church family and community, believing God answers prayer.',
        icon: 'fa-praying-hands',
        image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80',
        category: 'prayer',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    },
    {
        id: 'min-outreach',
        name: 'Outreach Ministry',
        leader: 'Maria Garcia',
        description: 'Serving our community with the love of Christ through practical acts of kindness.',
        icon: 'fa-hands-helping',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80',
        category: 'outreach',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    },
    {
        id: 'min-men',
        name: "Men's Ministry",
        leader: 'Robert Anderson',
        description: 'Building godly men through fellowship, accountability, and biblical teaching.',
        icon: 'fa-male',
        image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80',
        category: 'men',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    },
    {
        id: 'min-women',
        name: "Women's Ministry",
        leader: 'Jennifer Lee',
        description: 'Creating a space for women to grow spiritually and support one another in life\'s journey.',
        icon: 'fa-female',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        category: 'women',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    },
    {
        id: 'min-seniors',
        name: 'Seniors Ministry',
        leader: 'Dorothy Miller',
        description: 'Honoring and caring for our senior saints through fellowship and meaningful connections.',
        icon: 'fa-heart',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
        category: 'seniors',
        status: 'active',
        leaderEmail: '',
        leaderPhone: '',
        meetingDay: '',
        meetingTime: '',
        meetingLocation: '',
        budget: ''
    }
];

function cloneWebsiteMinistries() {
    return WEBSITE_MINISTRIES.map(ministry => ({ ...ministry }));
}

function readMinistryLedger() {
    const empty = {
        ministries: cloneWebsiteMinistries(),
        volunteers: [],
        activities: [],
        resources: [],
        seeded: false
    };
    try {
        const raw = localStorage.getItem(MINISTRY_STORAGE_KEY);
        if (raw === null || raw === '') return empty;
        const saved = JSON.parse(raw);
        const custom = Array.isArray(saved.ministries) ? saved.ministries : [];
        const volunteers = Array.isArray(saved.volunteers) ? saved.volunteers : [];
        const activities = Array.isArray(saved.activities) ? saved.activities : [];
        const resources = Array.isArray(saved.resources) ? saved.resources : [];
        if (saved.seeded) {
            return { ministries: custom, volunteers, activities, resources, seeded: true };
        }
        const merged = new Map(cloneWebsiteMinistries().map(ministry => [ministry.id, ministry]));
        custom.forEach(ministry => {
            if (!ministry || !ministry.id) return;
            const current = merged.get(ministry.id) || {};
            merged.set(ministry.id, { ...current, ...ministry });
        });
        return {
            ministries: [...merged.values()],
            volunteers,
            activities,
            resources,
            seeded: false
        };
    } catch (error) {
        console.error('Could not read ministries:', error);
        return empty;
    }
}

function writeMinistryLedger(ledger) {
    localStorage.setItem(MINISTRY_STORAGE_KEY, JSON.stringify({
        ministries: ledger.ministries || [],
        volunteers: ledger.volunteers || [],
        activities: ledger.activities || [],
        resources: ledger.resources || [],
        seeded: true
    }));
}

function websiteMinistries() {
    return readMinistryLedger().ministries.filter(ministry => ministry.status !== 'inactive');
}

function isMinistryImage(value) {
    const image = String(value || '').trim();
    return /^https?:\/\//i.test(image) || /^data:image\/(?:jpeg|jpg|png|webp|gif);base64,[a-z0-9+/=]+$/i.test(image);
}
