// Public Ministries section. The back office edits this list in the same browser.

function renderMinistries() {
    const ministriesGrid = document.getElementById('ministriesGrid');
    if (!ministriesGrid || typeof websiteMinistries !== 'function') return;

    const ministries = websiteMinistries();
    if (!ministries.length) {
        const empty = typeof window.siteT === 'function' && window.siteT('ministries.empty')
            ? window.siteT('ministries.empty')
            : 'Ministries will be listed here.';
        ministriesGrid.innerHTML = '<p class="section-subtitle">' + empty + '</p>';
        return;
    }

    ministriesGrid.innerHTML = ministries.map(ministry => {
        const image = safeMinistryImage(ministry.image);
        const photoKey = typeof ministryPhotoKey === 'function' ? ministryPhotoKey(ministry.image) : '';
        const icon = safeMinistryIcon(ministry.icon);
        const photo = photoKey
            ? `<img data-ministry-photo="${escapeMinistryText(photoKey)}" alt="${escapeMinistryText(translateMinistryText(ministry.name))}" class="ministry-image">`
            : image
            ? `<img src="${escapeMinistryText(image)}" alt="${escapeMinistryText(translateMinistryText(ministry.name))}" class="ministry-image">`
            : '<div class="ministry-image ministry-image-empty"></div>';
        const safeName = escapeMinistryText(translateMinistryText(ministry.name));
        const safeLeader = escapeMinistryText(ministry.leader);
        const ledBy = typeof window.siteT === 'function' && window.siteT('ministries.ledBy', { name: safeLeader })
            ? window.siteT('ministries.ledBy', { name: safeLeader })
            : 'Led by ' + safeLeader;
        const leader = ministry.leader
            ? `<p class="ministry-leader">${ledBy}</p>`
            : '';
        const description = ministry.description
            ? `<p class="ministry-description">${escapeMinistryText(translateMinistryText(ministry.description))}</p>`
            : '';
        return `
            <div class="ministry-card">
                ${photo}
                <div class="ministry-content">
                    <div class="ministry-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <h3 class="ministry-title">${safeName}</h3>
                    ${leader}
                    ${description}
                </div>
            </div>`;
    }).join('');
    if (typeof hydrateMinistryPhotos === 'function') hydrateMinistryPhotos(ministriesGrid);
}

function safeMinistryImage(value) {
    const image = String(value || '').trim();
    return typeof isMinistryImage === 'function' && isMinistryImage(image) ? image : '';
}

function safeMinistryIcon(value) {
    const icon = String(value || '').trim();
    return /^fa-[a-z0-9-]+$/i.test(icon) ? icon : 'fa-hands-praying';
}

const MINISTRY_PHRASES = {
    "Children's Ministry": 'ministries.cards.children.name',
    'Youth Ministry': 'ministries.cards.youth.name',
    'Worship Ministry': 'ministries.cards.worship.name',
    'Prayer Ministry': 'ministries.cards.prayer.name',
    'Outreach Ministry': 'ministries.cards.outreach.name',
    "Men's Ministry": 'ministries.cards.men.name',
    "Women's Ministry": 'ministries.cards.women.name',
    'Seniors Ministry': 'ministries.cards.seniors.name',
    'Pastoral Ministry': 'ministries.cards.pastoral.name',
    'Intercesory Ministry': 'ministries.cards.intercessory.name',
    'Intercessory Ministry': 'ministries.cards.intercessory.name',
    'Christian Education Ministry': 'ministries.cards.education.name',
    'Nurturing young hearts to know and love Jesus through engaging lessons and activities.': 'ministries.cards.children.description',
    'Empowering teens to grow in faith, build authentic friendships, and impact their world.': 'ministries.cards.youth.description',
    "Leading God's people in spirit-filled worship that honors Him and transforms lives.": 'ministries.cards.worship.description',
    'Interceding for our church family and community, believing God answers prayer.': 'ministries.cards.prayer.description',
    'Serving our community with the love of Christ through practical acts of kindness.': 'ministries.cards.outreach.description',
    'Building godly men through fellowship, accountability, and biblical teaching.': 'ministries.cards.men.description',
    "Creating a space for women to grow spiritually and support one another in life's journey.": 'ministries.cards.women.description',
    'Honoring and caring for our senior saints through fellowship and meaningful connections.': 'ministries.cards.seniors.description'
};

function translateMinistryText(value) {
    const text = String(value ?? '');
    const key = MINISTRY_PHRASES[text.replace(/\u2019/g, "'")];
    if (!key || typeof window.siteT !== 'function') return text;
    return window.siteT(key) || text;
}

function escapeMinistryText(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

document.addEventListener('DOMContentLoaded', renderMinistries);
document.addEventListener('site-language', renderMinistries);
