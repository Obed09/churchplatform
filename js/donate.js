/* ============================================ */
/* DONATION FUNCTIONALITY */
/* Handles frequency, purpose, currency, and amount */
/* ============================================ */

// PayPal Configuration
const PAYPAL_CONFIG = {
    email: 'amorporelcalvario@gmail.com',
    environment: 'live',
    churchName: 'Tabernacle Amour Pour Le Calvaire'
};

const ZELLE_CONFIG = {
    display: '+1 516-643-7811',
    copyValue: '5166437811'
};

// USD stays the default because this PayPal account charges in dollars.
// DOP is offered as Dominican pesos (shown as RD$).
const CURRENCIES = {
    USD: {
        code: 'USD',
        symbol: '$',
        amounts: [10, 20, 50, 100],
        placeholder: 'Custom amount',
        amountHeading: 'Choose Amount (USD)',
        note: 'Amounts are sent to PayPal in US dollars (USD).'
    },
    DOP: {
        code: 'DOP',
        symbol: 'RD$',
        amounts: [500, 1000, 2500, 5000],
        placeholder: 'Custom amount',
        amountHeading: 'Choose Amount (RD$)',
        note: 'Amounts are sent to PayPal in Dominican pesos (RD$).'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    let donationType = 'once'; // 'once' or 'monthly'
    let selectedPurpose = null;
    let selectedCurrency = 'USD';
    let selectedAmount = null;
    let selectedMethod = 'paypal';
    
    // Get elements
    const frequencyButtons = document.querySelectorAll('#frequencyToggle .toggle-btn');
    const purposeButtons = document.querySelectorAll('.purpose-btn');
    const otherPurposeGroup = document.getElementById('otherPurposeGroup');
    const otherPurposeInput = document.getElementById('otherPurpose');
    const currencyButtons = document.querySelectorAll('#currencyToggle .currency-btn');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountLabel = document.getElementById('amountLabel');
    const customAmountGroup = document.getElementById('customAmountGroup');
    const currencySymbol = document.getElementById('currencySymbol');
    const customAmountInput = document.getElementById('customAmount');
    const donationError = document.getElementById('donationError');
    const donationCurrencyNote = document.getElementById('donationCurrencyNote');
    const donateButton = document.getElementById('donateBtn');
    const payMethodButtons = document.querySelectorAll('#payMethods .pay-method');
    const paypalPay = document.getElementById('paypalPay');
    const zellePanel = document.getElementById('zellePanel');
    const zelleSummary = document.getElementById('zelleSummary');
    const zelleCopyBtn = document.getElementById('zelleCopyBtn');
    const zelleCopyStatus = document.getElementById('zelleCopyStatus');
    const dopCurrencyButton = document.querySelector('#currencyToggle [data-currency="DOP"]');
    
    // ============================================
    // DONATION TYPE TOGGLE (Give Once / Monthly)
    // ============================================
    frequencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            frequencyButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            donationType = this.dataset.type;
            clearError();
        });
    });

    // ============================================
    // GIVING PURPOSE
    // ============================================
    purposeButtons.forEach(button => {
        button.addEventListener('click', function() {
            purposeButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.setAttribute('aria-pressed', 'false');
            });

            this.classList.add('selected');
            this.setAttribute('aria-pressed', 'true');
            selectedPurpose = this.dataset.purpose;

            const isOther = selectedPurpose === 'Other';
            otherPurposeGroup.hidden = !isOther;
            if (!isOther) {
                otherPurposeInput.value = '';
            } else {
                otherPurposeInput.focus();
            }
            clearError();
            updateZelleSummary();
        });
    });

    if (otherPurposeInput) {
        otherPurposeInput.addEventListener('input', function() {
            clearError();
            updateZelleSummary();
        });
    }

    // ============================================
    // CURRENCY (RD$ / USD)
    // ============================================
    currencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            currencyButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            applyCurrency(this.dataset.currency);
            clearError();
        });
    });
    
    // ============================================
    // PRESET AMOUNT SELECTION
    // ============================================
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedAmount = parseAmount(this.dataset.amount);
            customAmountInput.value = '';
            clearError();
            updateZelleSummary();
        });
    });
    
    // ============================================
    // CUSTOM AMOUNT INPUT
    // ============================================
    customAmountInput.addEventListener('input', function() {
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        selectedAmount = parseAmount(this.value);
        clearError();
        updateZelleSummary();
    });

    payMethodButtons.forEach(button => {
        button.addEventListener('click', function() {
            setPayMethod(this.dataset.method);
            if (this.dataset.method !== 'zelle') {
                beginPayPalCheckout();
            }
        });
    });

    if (zelleCopyBtn) {
        zelleCopyBtn.addEventListener('click', copyZelleNumber);
    }

    document.addEventListener('site-language', function () {
        const currency = CURRENCIES[selectedCurrency];
        amountLabel.textContent = tr(selectedCurrency === 'DOP' ? 'donate.amountDop' : 'donate.amountUsd', currency.amountHeading);
        customAmountInput.placeholder = tr('donate.customAmount', currency.placeholder);
        donationCurrencyNote.textContent = tr(selectedCurrency === 'DOP' ? 'donate.noteDop' : 'donate.noteUsd', currency.note);
        updateZelleSummary();
    });
    
    // ============================================
    // DONATE BUTTON CLICK
    // ============================================
    donateButton.addEventListener('click', beginPayPalCheckout);
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function parseAmount(value) {
        const amount = Number(value);
        if (!Number.isFinite(amount) || amount <= 0) {
            return null;
        }
        return Math.round(amount * 100) / 100;
    }

    function tr(key, fallback, vars) {
        if (typeof window.siteT === 'function') {
            const value = window.siteT(key, vars);
            if (value) {
                return value;
            }
        }
        return fallback;
    }

    function getPurposeLabel() {
        const purposeKeys = {
            Tithe: 'donate.tithe',
            Offering: 'donate.offering',
            'Special Offering': 'donate.special',
            Donation: 'donate.donation'
        };
        if (!selectedPurpose) {
            return null;
        }
        if (selectedPurpose === 'Other') {
            const detail = otherPurposeInput.value.trim();
            return detail ? tr('donate.other', 'Other') + ': ' + detail : null;
        }
        return tr(purposeKeys[selectedPurpose], selectedPurpose);
    }

    function applyCurrency(currencyKey) {
        const currency = CURRENCIES[currencyKey];
        if (!currency) {
            return;
        }

        selectedCurrency = currencyKey;
        selectedAmount = null;
        customAmountInput.value = '';
        amountButtons.forEach((button, index) => {
            const amount = currency.amounts[index];
            button.dataset.amount = String(amount);
            button.textContent = currency.symbol + amount.toLocaleString('en-US');
            button.classList.remove('selected');
        });

        amountLabel.textContent = tr(currencyKey === 'DOP' ? 'donate.amountDop' : 'donate.amountUsd', currency.amountHeading);
        currencySymbol.textContent = currency.symbol;
        customAmountInput.placeholder = tr('donate.customAmount', currency.placeholder);
        customAmountGroup.classList.toggle('is-dop', currencyKey === 'DOP');
        donationCurrencyNote.textContent = tr(currencyKey === 'DOP' ? 'donate.noteDop' : 'donate.noteUsd', currency.note);
        updateZelleSummary();
    }

    function setPayMethod(method) {
        selectedMethod = method === 'zelle' ? 'zelle' : 'paypal';
        const isZelle = selectedMethod === 'zelle';

        payMethodButtons.forEach(button => {
            const active = button.dataset.method === selectedMethod;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        paypalPay.hidden = isZelle;
        zellePanel.hidden = !isZelle;
        dopCurrencyButton.disabled = isZelle;

        if (isZelle && selectedCurrency !== 'USD') {
            currencyButtons.forEach(button => {
                const active = button.dataset.currency === 'USD';
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            applyCurrency('USD');
        }

        clearError();
        updateZelleSummary();
    }

    function updateZelleSummary() {
        if (!zelleSummary) {
            return;
        }

        const purpose = getPurposeLabel();
        const currency = CURRENCIES[selectedCurrency];
        const amountText = selectedAmount
            ? currency.symbol + selectedAmount.toLocaleString('en-US')
            : '';

        if (purpose && amountText) {
            zelleSummary.textContent = tr('donate.summaryGift', 'Send ' + amountText + ' for ' + purpose + '.', { amount: amountText, purpose: purpose });
        } else if (purpose) {
            zelleSummary.textContent = tr('donate.summaryPurpose', 'This gift is for ' + purpose + '. Choose an amount, then send it with Zelle.', { purpose: purpose });
        } else if (amountText) {
            zelleSummary.textContent = tr('donate.summaryAmount', 'Send ' + amountText + '. Choose what this gift is for, and put that in the Zelle memo.', { amount: amountText });
        } else {
            zelleSummary.textContent = tr('donate.summaryEmpty', 'Choose a purpose and amount above, then send that gift to this number.');
        }
    }

    function copyZelleNumber() {
        const text = ZELLE_CONFIG.copyValue;

        function showCopied() {
            zelleCopyStatus.textContent = tr('donate.copied', 'Copied ' + text + '. Paste it into Zelle.', { number: text });
        }

        function fallbackCopy() {
            const field = document.createElement('textarea');
            field.value = text;
            field.setAttribute('readonly', '');
            field.style.position = 'fixed';
            field.style.left = '-9999px';
            document.body.appendChild(field);
            field.select();
            let copied = false;
            try {
                copied = document.execCommand('copy');
            } catch (err) {
                copied = false;
            }
            document.body.removeChild(field);
            if (copied) {
                showCopied();
            } else {
                zelleCopyStatus.textContent = tr('donate.copyFallback', 'Copy this number into Zelle: ' + ZELLE_CONFIG.display, { display: ZELLE_CONFIG.display });
            }
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(showCopied, fallbackCopy);
        } else {
            fallbackCopy();
        }
    }

    function beginPayPalCheckout() {
        if (selectedMethod === 'zelle') {
            updateZelleSummary();
            zellePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
        }

        const purposeLabel = getPurposeLabel();

        if (!selectedPurpose) {
            showError(tr('donate.errorPurpose', 'Please choose what this gift is for.'));
            return;
        }

        if (selectedPurpose === 'Other' && !purposeLabel) {
            showError(tr('donate.errorOther', 'Please specify what this gift is for.'));
            otherPurposeInput.focus();
            return;
        }

        if (!selectedAmount || selectedAmount <= 0) {
            showError(tr('donate.errorAmount', 'Please select or enter a donation amount.'));
            return;
        }

        clearError();
        redirectToPayPal(donationType, selectedAmount, purposeLabel, CURRENCIES[selectedCurrency].code);
    }

    function showError(message) {
        donationError.textContent = message;
        donationError.hidden = false;
        donationError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearError() {
        donationError.textContent = '';
        donationError.hidden = true;
    }
    
    function resetDonationForm() {
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        customAmountInput.value = '';
        selectedAmount = null;
    }
    
    // ============================================
    // PAYMENT PROCESSOR INTEGRATIONS
    // ============================================
    
    // PayPal Integration
    function redirectToPayPal(type, amount, purposeLabel, currencyCode) {
        const frequency = type === 'monthly' ? ' (Monthly)' : '';
        const itemName = purposeLabel + frequency + ' — ' + PAYPAL_CONFIG.churchName;
        const paypalUrl = 'https://www.paypal.com/donate?business=' + encodeURIComponent(PAYPAL_CONFIG.email)
            + '&amount=' + encodeURIComponent(amount)
            + '&currency_code=' + encodeURIComponent(currencyCode)
            + '&item_name=' + encodeURIComponent(itemName);

        // Monthly gifts still open PayPal as a one-time payment until a Business subscription is configured.
        if (type !== 'once') {
            alert(tr('donate.monthlyAlert', 'Monthly recurring donations require a PayPal Business account.\n\nYou can still make a one-time donation now and set up recurring payments in your PayPal account.'));
        }

        window.location.href = paypalUrl;
    }
    
    // Example 2: Stripe Checkout Integration
    /*
    function redirectToStripe(type, amount) {
        // Load Stripe.js first: <script src="https://js.stripe.com/v3/"></script>
        const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
        
        fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                amount: amount
            })
        })
        .then(response => response.json())
        .then(session => {
            return stripe.redirectToCheckout({ sessionId: session.id });
        });
    }
    */
    
    // Example 3: Tithe.ly Integration
    /*
    function redirectToTithely(type, amount) {
        const tithelyUrl = `https://tithe.ly/give_new/www/#/tithely/give-one-time/YOUR_CHURCH_ID?amount=${amount}`;
        window.open(tithelyUrl, '_blank');
    }
    */
    
    // Example 4: Pushpay Integration
    /*
    function redirectToPushpay(type, amount) {
        const pushpayUrl = `https://pushpay.com/g/YOUR_CHURCH_HANDLE?a=${amount}&r=${type === 'monthly' ? 'monthly' : 'once'}`;
        window.open(pushpayUrl, '_blank');
    }
    */
    
    // ============================================
    // KEYBOARD SUPPORT
    // ============================================
    
    // Allow Enter key to submit
    customAmountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            donateButton.click();
        }
    });
    
    // Quick amount selection with keyboard (1-4), ignored while typing in a field
    document.addEventListener('keypress', function(e) {
        if (e.target.closest('input, textarea, select')) {
            return;
        }
        const key = e.key;
        if (key >= '1' && key <= '4') {
            const index = parseInt(key) - 1;
            if (amountButtons[index]) {
                amountButtons[index].click();
            }
        }
    });
});

/* ============================================ */
/* PAYMENT PROCESSOR SETUP GUIDES */
/* ============================================ */

/*
=== PAYPAL SETUP ===
1. Create PayPal Business account
2. Get your PayPal email
3. Create donation button at: https://www.paypal.com/donate/buttons
4. Use the generated link in redirectToPayPal()

=== STRIPE SETUP ===
1. Create Stripe account at stripe.com
2. Get your Publishable Key from Dashboard
3. Create backend endpoint for checkout sessions
4. Install Stripe library: npm install stripe
5. Follow: https://stripe.com/docs/payments/checkout

=== TITHE.LY SETUP ===
1. Sign up at tithe.ly
2. Get your Church ID from settings
3. Customize giving page
4. Use the giving page URL in redirectToTithely()

=== PUSHPAY SETUP ===
1. Contact Pushpay for church account
2. Get your church handle
3. Customize payment page
4. Use the payment URL in redirectToPushpay()

=== GIVELIFY SETUP ===
Similar to above services, create account and get integration details

=== PAYPAL DONATIONS BUTTON ===
Easiest option:
1. Go to: https://www.paypal.com/donate/buttons/manage
2. Create button
3. Copy button HTML code
4. Replace the donate section with PayPal's button code
*/
