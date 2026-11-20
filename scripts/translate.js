/**
 * Fill missing translation keys from locales/en.json.
 *
 * Existing keys in a target file are left untouched, including empty strings,
 * so manual corrections stay in place.
 *
 * Usage:
 *   npm run translate
 *   npm run translate:check
 *
 * Credentials, in .env (see .env.example):
 *   GOOGLE_TRANSLATE_API_KEY
 *   or GOOGLE_APPLICATION_CREDENTIALS
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALES = path.join(ROOT, 'locales');
const SOURCE_LANG = 'en';
const TARGET_LANGS = ['fr', 'es', 'ht'];

function loadEnv(file) {
    if (!fs.existsSync(file)) {
        return;
    }
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach(function (line) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }
        const eq = trimmed.indexOf('=');
        if (eq === -1) {
            return;
        }
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        if (process.env[key] === undefined) {
            process.env[key] = value;
        }
    });
}

function readJson(file) {
    if (!fs.existsSync(file)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function getPath(obj, keyPath) {
    return keyPath.split('.').reduce(function (node, part) {
        if (!node || typeof node !== 'object') {
            return undefined;
        }
        return node[part];
    }, obj);
}

function setPath(obj, keyPath, value) {
    const parts = keyPath.split('.');
    let node = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]] || typeof node[parts[i]] !== 'object' || Array.isArray(node[parts[i]])) {
            node[parts[i]] = {};
        }
        node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
}

function flattenStrings(obj, prefix, out) {
    Object.keys(obj || {}).forEach(function (key) {
        const value = obj[key];
        const next = prefix ? prefix + '.' + key : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            flattenStrings(value, next, out);
        } else if (typeof value === 'string') {
            out.push({ path: next, text: value });
        }
    });
    return out;
}

function missingKeys(source, target) {
    return flattenStrings(source, '', []).filter(function (entry) {
        return typeof getPath(target, entry.path) !== 'string';
    });
}

function applyMissing(target, entries) {
    entries.forEach(function (entry) {
        if (typeof getPath(target, entry.path) === 'string') {
            return;
        }
        setPath(target, entry.path, entry.text);
    });
    return target;
}

function chunk(items, size) {
    const groups = [];
    for (let i = 0; i < items.length; i += size) {
        groups.push(items.slice(i, i + size));
    }
    return groups;
}

function createClient() {
    const { Translate } = require('@google-cloud/translate').v2;
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
        return new Translate({ key: apiKey });
    }
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        return new Translate();
    }
    throw new Error('Set GOOGLE_TRANSLATE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS in .env');
}

async function translateMissing(client, lang, entries) {
    const translated = [];
    const groups = chunk(entries, 80);
    for (let g = 0; g < groups.length; g++) {
        const group = groups[g];
        const blanks = [];
        const texts = [];
        group.forEach(function (entry, index) {
            if (entry.text.trim() === '') {
                blanks.push(index);
            } else {
                texts.push(entry.text);
            }
        });
        let results = [];
        if (texts.length) {
            const response = await client.translate(texts, { from: SOURCE_LANG, to: lang });
            results = Array.isArray(response[0]) ? response[0] : [response[0]];
        }
        let cursor = 0;
        group.forEach(function (entry, index) {
            if (blanks.indexOf(index) !== -1) {
                translated.push({ path: entry.path, text: entry.text });
            } else {
                translated.push({ path: entry.path, text: results[cursor] });
                cursor += 1;
            }
        });
    }
    return translated;
}

function selfTest() {
    const source = {
        nav: { home: 'Accueil', donate: 'Don' },
        hero: { title: 'Bienvenue' }
    };
    const target = {
        nav: { home: 'Inicio corregido', extra: 'Conservé' },
        note: ''
    };
    const missing = missingKeys(source, target).map(function (entry) {
        return entry.path;
    });
    if (missing.join(',') !== 'nav.donate,hero.title') {
        throw new Error('Missing-key detection failed: ' + missing.join(','));
    }
    applyMissing(target, [
        { path: 'nav.donate', text: 'Donar' },
        { path: 'nav.home', text: 'SHOULD NOT APPLY' },
        { path: 'hero.title', text: 'Bienvenido' }
    ]);
    if (target.nav.home !== 'Inicio corregido') {
        throw new Error('Existing translation was overwritten');
    }
    if (target.nav.extra !== 'Conservé' || target.note !== '') {
        throw new Error('Manual keys were not preserved');
    }
    if (target.nav.donate !== 'Donar' || target.hero.title !== 'Bienvenido') {
        throw new Error('Missing keys were not added');
    }
    const emptyKept = { hero: { title: '' } };
    if (missingKeys({ hero: { title: 'Bienvenue' } }, emptyKept).length !== 0) {
        throw new Error('Empty manual value was treated as missing');
    }
    console.log('self-test passed: existing keys are preserved');
}

async function main() {
    if (process.argv.indexOf('--self-test') !== -1) {
        selfTest();
        return;
    }

    loadEnv(path.join(ROOT, '.env'));
    const source = readJson(path.join(LOCALES, SOURCE_LANG + '.json'));
    const client = createClient();

    for (let i = 0; i < TARGET_LANGS.length; i++) {
        const lang = TARGET_LANGS[i];
        const file = path.join(LOCALES, lang + '.json');
        const target = readJson(file);
        const missing = missingKeys(source, target);
        if (!missing.length) {
            console.log(lang + '.json: nothing missing');
            continue;
        }
        const translated = await translateMissing(client, lang, missing);
        applyMissing(target, translated);
        fs.writeFileSync(file, JSON.stringify(target, null, 2) + '\n');
        console.log(lang + '.json: added ' + translated.length + ' missing key(s)');
    }
}

main().catch(function (err) {
    console.error(err.message || err);
    process.exit(1);
});
