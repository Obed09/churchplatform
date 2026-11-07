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
    if (/^https?:\/\//i.test(image)) return true;
    if (/^data:image\/svg/i.test(image)) return false;
    return /^data:image\/[a-z0-9.+-]+;base64,/i.test(image);
}

function ministryPhotoKey(value) {
    const match = String(value || '').trim().match(/^idb:([a-z0-9-]{4,80})$/i);
    return match ? match[1] : '';
}

function isStoredMinistryPhoto(value) {
    return isMinistryImage(value) || Boolean(ministryPhotoKey(value));
}

function createMinistryPhotoKey() {
    return 'photo-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function ministryPhotoDb() {
    return new Promise(function(resolve, reject) {
        const request = indexedDB.open('churchMinistryPhotos', 1);
        request.onupgradeneeded = function() {
            if (!request.result.objectStoreNames.contains('photos')) {
                request.result.createObjectStore('photos');
            }
        };
        request.onsuccess = function() {
            resolve(request.result);
        };
        request.onerror = function() {
            reject(request.error || new Error('unreadable'));
        };
    });
}

function saveMinistryPhotoBlob(key, file) {
    const type = String(file.type || '').toLowerCase();
    const blob = type.startsWith('image/') && !type.includes('svg') ? file : new Blob([file], { type: 'image/jpeg' });
    return ministryPhotoDb().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction('photos', 'readwrite');
            transaction.objectStore('photos').put(blob, key);
            transaction.oncomplete = function() {
                db.close();
                resolve(key);
            };
            transaction.onerror = function() {
                db.close();
                reject(transaction.error || new Error('unreadable'));
            };
        });
    });
}

function loadMinistryPhotoBlob(key) {
    return ministryPhotoDb().then(function(db) {
        return new Promise(function(resolve, reject) {
            const transaction = db.transaction('photos', 'readonly');
            const request = transaction.objectStore('photos').get(key);
            request.onsuccess = function() {
                db.close();
                resolve(request.result || null);
            };
            request.onerror = function() {
                db.close();
                reject(request.error || new Error('unreadable'));
            };
        });
    });
}

function deleteMinistryPhotoBlob(key) {
    if (!key) return Promise.resolve();
    return ministryPhotoDb().then(function(db) {
        return new Promise(function(resolve) {
            const transaction = db.transaction('photos', 'readwrite');
            transaction.objectStore('photos').delete(key);
            transaction.oncomplete = function() {
                db.close();
                resolve();
            };
            transaction.onerror = function() {
                db.close();
                resolve();
            };
        });
    }).catch(function() {});
}

function blobToDataUrl(blob) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onerror = function() {
            reject(reader.error || new Error('unreadable'));
        };
        reader.onload = function() {
            resolve(String(reader.result || ''));
        };
        reader.readAsDataURL(blob);
    });
}

function hydrateMinistryPhotos(root) {
    if (!root) return;
    root.querySelectorAll('[data-ministry-photo]').forEach(function(img) {
        const key = img.getAttribute('data-ministry-photo');
        if (!key) return;
        loadMinistryPhotoBlob(key).then(function(blob) {
            if (!blob || img.getAttribute('data-ministry-photo') !== key) return null;
            return blobToDataUrl(blob);
        }).then(function(url) {
            if (!url || img.getAttribute('data-ministry-photo') !== key) return;
            img.src = url;
        }).catch(function() {});
    });
}
