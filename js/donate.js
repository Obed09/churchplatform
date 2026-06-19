/* ============================================ */
/* DONATION FUNCTIONALITY */
/* Handles donation type toggle and amount selection */
/* ============================================ */

// PayPal Configuration
const PAYPAL_CONFIG = {
    email: 'amorporelcalvario@gmail.com',
    currency: 'USD', // PayPal Personal accounts in DR only accept USD
    currencySymbol: '$',
    environment: 'live',
    itemName: 'Donation to Tabernacle Amour Pour Le Calvaire'
};

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    let donationType = 'once'; // 'once' or 'monthly'
    let selectedAmount = null;
    
    // Get elements
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const donateButton = document.getElementById('donateBtn');
    
    // ============================================
    // DONATION TYPE TOGGLE (Give Once / Monthly)
    // ============================================
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update donation type
            donationType = this.dataset.type;
            
            console.log('Donation type:', donationType);
        });
    });
    
    // ============================================
    // PRESET AMOUNT SELECTION
    // ============================================
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all amount buttons
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Update selected amount
            selectedAmount = parseInt(this.dataset.amount);
            
            // Clear custom input
            customAmountInput.value = '';
            
            console.log('Selected amount: ' + PAYPAL_CONFIG.currencySymbol + selectedAmount);
        });
    });
    
    // ============================================
    // CUSTOM AMOUNT INPUT
    // ============================================
    customAmountInput.addEventListener('input', function() {
        // Remove selected class from preset buttons
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Update selected amount
        selectedAmount = parseInt(this.value) || null;
        
        console.log('Custom amount: ' + PAYPAL_CONFIG.currencySymbol + selectedAmount);
    });
    
    // ============================================
    // DONATE BUTTON CLICK
    // ============================================
    donateButton.addEventListener('click', function() {
        // Validate amount
        if (!selectedAmount || selectedAmount <= 0) {
            alert('Please select or enter a donation amount.');
            return;
        }
        
        // Log donation details
        console.log('Processing donation:', {
            type: donationType,
            amount: selectedAmount
        });
        
        // Redirect to PayPal for payment processing
        redirectToPayPal(donationType, selectedAmount);
    });
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    function resetDonationForm() {
        amountButtons.forEach(btn => btn.classList.remove('selected'));
        customAmountInput.value = '';
        selectedAmount = null;
    }
    
    // ============================================
    // PAYMENT PROCESSOR INTEGRATIONS
    // ============================================
    
    // PayPal Integration
    function redirectToPayPal(type, amount) {
        // For one-time donations
        if (type === 'once') {
            const paypalUrl = `https://www.paypal.com/donate?business=${encodeURIComponent(PAYPAL_CONFIG.email)}&amount=${amount}&currency_code=${PAYPAL_CONFIG.currency}&item_name=${encodeURIComponent(PAYPAL_CONFIG.itemName)}`;
            window.location.href = paypalUrl; // Opens in same tab
        } 
        // For monthly subscriptions (Note: Requires PayPal Business account for subscription setup)
        else {
            // For now, redirect to one-time donation with a note
            alert('Monthly recurring donations require PayPal Business account setup.\n\nYou can still make a one-time donation now and set up recurring payments in your PayPal account.');
            const paypalUrl = `https://www.paypal.com/donate?business=${encodeURIComponent(PAYPAL_CONFIG.email)}&amount=${amount}&currency_code=${PAYPAL_CONFIG.currency}&item_name=${encodeURIComponent(PAYPAL_CONFIG.itemName + ' - Monthly')}`;
            window.location.href = paypalUrl; // Opens in same tab
        }
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
    
    // Quick amount selection with keyboard (1-4)
    document.addEventListener('keypress', function(e) {
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
