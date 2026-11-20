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
            ? `<img data-ministry-photo="${escapeMinistryText(photoKey)}" alt="${escapeMinistryText(ministry.name)}" class="ministry-image">`
            : image
            ? `<img src="${escapeMinistryText(image)}" alt="${escapeMinistryText(ministry.name)}" class="ministry-image">`
            : '<div class="ministry-image ministry-image-empty"></div>';
        const safeLeader = escapeMinistryText(ministry.leader);
        const ledBy = typeof window.siteT === 'function' && window.siteT('ministries.ledBy', { name: safeLeader })
            ? window.siteT('ministries.ledBy', { name: safeLeader })
            : 'Led by ' + safeLeader;
        const leader = ministry.leader
            ? `<p class="ministry-leader">${ledBy}</p>`
            : '';
        const description = ministry.description
            ? `<p class="ministry-description">${escapeMinistryText(ministry.description)}</p>`
            : '';
        return `
            <div class="ministry-card">
                ${photo}
                <div class="ministry-content">
                    <div class="ministry-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <h3 class="ministry-title">${escapeMinistryText(ministry.name)}</h3>
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
