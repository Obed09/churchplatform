/* ============================================ */
/* CONTACT FORM WITH VALIDATION */
/* Fully functional front-end form */
/* ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm) return;
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual backend call)
        setTimeout(() => {
            // ============================================
            // REPLACE THIS WITH YOUR ACTUAL FORM SUBMISSION
            // Options:
            // 1. Send to email service (EmailJS, Formspree, etc.)
            // 2. Send to your backend API
            // 3. Use a form service like Google Forms
            // ============================================
            
            console.log('Form submitted:', formData);
            
            // Show success message
            showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            
        }, 2000); // Simulated delay
    });
    
    // ============================================
    // FORM VALIDATION
    // ============================================
    function validateForm(data) {
        // Check required fields
        if (!data.name) {
            showMessage('Please enter your name.', 'error');
            return false;
        }
        
        if (!data.email) {
            showMessage('Please enter your email address.', 'error');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!data.subject) {
            showMessage('Please enter a subject.', 'error');
            return false;
        }
        
        if (!data.message) {
            showMessage('Please enter your message.', 'error');
            return false;
        }
        
        // Validate message length
        if (data.message.length < 10) {
            showMessage('Please enter a message with at least 10 characters.', 'error');
            return false;
        }
        
        return true;
    }
    
    // ============================================
    // SHOW MESSAGE HELPER
    // ============================================
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // ============================================
    // REAL-TIME VALIDATION (OPTIONAL)
    // Remove focus error styling when user types
    // ============================================
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });
});

/* ============================================ */
/* INTEGRATION EXAMPLES */
/* ============================================ */

// Example 1: EmailJS Integration
// Uncomment and configure if using EmailJS
/*
function sendEmailWithEmailJS(formData) {
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
    }).then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showMessage('Thank you! Your message has been sent.', 'success');
    }, function(error) {
        console.log('FAILED...', error);
        showMessage('Sorry, there was an error. Please try again.', 'error');
    });
}
*/

// Example 2: Fetch API to backend
/*
function sendToBackend(formData) {
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Thank you! Your message has been sent.', 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Sorry, there was an error. Please try again.', 'error');
    });
}
*/

// Example 3: Formspree Integration
/*
function sendToFormspree(formData) {
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showMessage('Thank you! Your message has been sent.', 'success');
        } else {
            showMessage('Sorry, there was an error. Please try again.', 'error');
        }
    });
}
*/
