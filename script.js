
    document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.contact-form');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const queryRadios = document.querySelectorAll('input[name="query"]');
  const message = document.getElementById('message');
  const consent = document.getElementById('consent');

  // Function to show error message
  function showError(fieldId, errorMessage) {
    const errorElement = document.getElementById(fieldId + '-error');
    const field = document.getElementById(fieldId);
    
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'block';
    
    if (field) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', fieldId + '-error');
    }
  }

  // Function to hide error message
  function hideError(fieldId) {
    const errorElement = document.getElementById(fieldId + '-error');
    const field = document.getElementById(fieldId);
    
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    
    if (field) {
      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('aria-describedby');
    }
  }

  // Function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to show success message with fade-in/fade-out
  function showSuccessMessage() {
    // Remove any existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.setAttribute('role', 'alert');
    successDiv.setAttribute('aria-live', 'polite');
    successDiv.innerHTML = `
      <h3>Message Sent!</h3>
      <p>Thanks for completing the form. We'll be in touch soon!</p>
    `;
    
    // Add to body (positioned fixed, so it appears above everything)
    document.body.appendChild(successDiv);
    
    // Trigger fade-in animation
    setTimeout(() => {
      successDiv.classList.add('show');
    }, 100);
    
    // Focus on success message for screen readers
    successDiv.setAttribute('tabindex', '-1');
    successDiv.focus();
    
    // Auto-hide after 5 seconds with fade-out
    setTimeout(() => {
      successDiv.classList.remove('show');
      // Remove element after transition completes
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.remove();
        }
      }, 300);
    }, 5000);
    
    // Reset form
    form.reset();
    
    // Remove selected class from radio options
    document.querySelectorAll('.radio-option').forEach(option => {
      option.classList.remove('selected');
    });
  }

  // Real-time validation
  firstName.addEventListener('blur', function() {
    if (this.value.trim() === '') {
      showError('firstName', 'This field is required');
    } else {
      hideError('firstName');
    }
  });

  lastName.addEventListener('blur', function() {
    if (this.value.trim() === '') {
      showError('lastName', 'This field is required');
    } else {
      hideError('lastName');
    }
  });

  email.addEventListener('blur', function() {
    if (this.value.trim() === '') {
      showError('email', 'Please enter a valid email address');
    } else if (!isValidEmail(this.value)) {
      showError('email', 'Please enter a valid email address');
    } else {
      hideError('email');
    }
  });

  message.addEventListener('blur', function() {
    if (this.value.trim() === '') {
      showError('message', 'This field is required');
    } else {
      hideError('message');
    }
  });

  // Radio button selection visual feedback
  queryRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Remove selected class from all radio options
      document.querySelectorAll('.radio-option').forEach(option => {
        option.classList.remove('selected');
      });
      
      // Add selected class to the parent of the checked radio
      if (this.checked) {
        this.closest('.radio-option').classList.add('selected');
        hideError('query');
      }
    });
  });

  // Keyboard navigation for radio buttons
  queryRadios.forEach((radio, index) => {
    radio.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % queryRadios.length;
        queryRadios[nextIndex].focus();
        queryRadios[nextIndex].checked = true;
        queryRadios[nextIndex].dispatchEvent(new Event('change'));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + queryRadios.length) % queryRadios.length;
        queryRadios[prevIndex].focus();
        queryRadios[prevIndex].checked = true;
        queryRadios[prevIndex].dispatchEvent(new Event('change'));
      }
    });
  });

  // Form submission validation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    let firstErrorField = null;

    // Validate First Name
    if (firstName.value.trim() === '') {
      showError('firstName', 'This field is required');
      isValid = false;
      if (!firstErrorField) firstErrorField = firstName;
    } else {
      hideError('firstName');
    }

    // Validate Last Name
    if (lastName.value.trim() === '') {
      showError('lastName', 'This field is required');
      isValid = false;
      if (!firstErrorField) firstErrorField = lastName;
    } else {
      hideError('lastName');
    }

    // Validate Email
    if (email.value.trim() === '' || !isValidEmail(email.value)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
      if (!firstErrorField) firstErrorField = email;
    } else {
      hideError('email');
    }

    // Validate Query Type
    const selectedQuery = document.querySelector('input[name="query"]:checked');
    if (!selectedQuery) {
      showError('query', 'Please select a query type');
      isValid = false;
      if (!firstErrorField) firstErrorField = queryRadios[0];
    } else {
      hideError('query');
    }

    // Validate Message
    if (message.value.trim() === '') {
      showError('message', 'This field is required');
      isValid = false;
      if (!firstErrorField) firstErrorField = message;
    } else {
      hideError('message');
    }

    // Validate Consent
    if (!consent.checked) {
      showError('consent', 'To submit this form, please consent to being contacted');
      isValid = false;
      if (!firstErrorField) firstErrorField = consent;
    } else {
      hideError('consent');
    }

    if (isValid) {
      // Form is valid - show success message
      showSuccessMessage();
    } else {
      // Focus on first error field for accessibility
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }
  });

  // Hide error on checkbox change
  consent.addEventListener('change', function() {
    if (this.checked) {
      hideError('consent');
    }
  });

  // Add ARIA labels and descriptions for better accessibility
  function setupAccessibility() {
    // Add aria-required to required fields
    [firstName, lastName, email, message, consent].forEach(field => {
      field.setAttribute('aria-required', 'true');
    });

    // Add role and aria-labelledby to radio group
    const radioGroup = document.querySelector('.radio-group');
    radioGroup.setAttribute('role', 'radiogroup');
    radioGroup.setAttribute('aria-labelledby', 'query-label');
    
    // Add id to query type label
    const queryLabels = document.querySelectorAll('label');
    queryLabels.forEach(label => {
      if (label.textContent.includes('Query Type')) {
        label.id = 'query-label';
      }
    });
  }

  // Initialize accessibility features
  setupAccessibility();
});