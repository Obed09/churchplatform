/* Public website languages. Admin pages do not load this file. */
(function () {
    var LANGS = ['fr', 'es', 'en', 'ht'];
    var DEFAULT_LANG = 'fr';
    var STORAGE_KEY = 'siteLang';
    var currentDict = null;

    function format(value, vars) {
        if (!vars) {
            return value;
        }
        return value.replace(/\{(\w+)\}/g, function (_, name) {
            return vars[name] == null ? '' : String(vars[name]);
        });
    }

    window.siteT = function (key, vars) {
        var value = lookup(currentDict, key);
        return typeof value === 'string' ? format(value, vars) : '';
    };

    function preferredLang() {
        var saved = '';
        try {
            saved = localStorage.getItem(STORAGE_KEY) || '';
        } catch (err) {
            saved = '';
        }
        return LANGS.indexOf(saved) !== -1 ? saved : DEFAULT_LANG;
    }

    function lookup(dict, key) {
        return key.split('.').reduce(function (node, part) {
            if (!node || typeof node !== 'object') {
                return undefined;
            }
            return node[part];
        }, dict);
    }

    function markActive(lang) {
        document.querySelectorAll('.lang-btn').forEach(function (button) {
            var active = button.getAttribute('data-lang') === lang;
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function apply(dict) {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var value = lookup(dict, el.getAttribute('data-i18n'));
            if (typeof value !== 'string') {
                return;
            }
            var attr = el.getAttribute('data-i18n-attr');
            if (attr) {
                el.setAttribute(attr, value);
            } else {
                el.textContent = value;
            }
        });
    }

    function setLanguage(lang) {
        if (LANGS.indexOf(lang) === -1) {
            lang = DEFAULT_LANG;
        }
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (err) {
            /* Private browsing can block storage. The choice still applies this visit. */
        }
        document.documentElement.lang = lang;
        markActive(lang);
        return fetch('locales/' + lang + '.json', { cache: 'no-cache' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Missing locale ' + lang);
                }
                return response.json();
            })
            .then(function (dict) {
                currentDict = dict;
                apply(dict);
                document.dispatchEvent(new CustomEvent('site-language', { detail: { lang: lang } }));
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    function init() {
        document.querySelectorAll('.lang-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                setLanguage(button.getAttribute('data-lang'));
            });
        });
        setLanguage(preferredLang());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
