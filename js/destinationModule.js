const DestinationModule = {
 
  // --- init: sets up the form event listeners ---
  init() {
    const form = document.getElementById('add-form');
    if (!form) return;
 
    // Event listener with callback — preventDefault stops the default form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // prevent page reload on submit (Form methods - Week 6)
      this.handleSubmit(); // 'this' refers to DestinationModule
    });
 
    // Cancel button navigates back without saving
    document.getElementById('cancel-btn')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  },
 
  // --- handleSubmit: reads form values and saves destination ---
  handleSubmit() {
 
    // Form properties: accessing input values via getElementById
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const plannedDate = document.getElementById('plannedDate').value;
    const notes = document.getElementById('notes').value.trim();
 
    // Client-side form validation (Week 6)
    if (!city || !country) {
      this.showError('City and country are required.');
      return; // stop execution if validation fails
    }
 
    // Spread syntax: build a clean new destination object
    const newDestination = {
      ...{ city, country, plannedDate, notes },
      description: '',
      visited: false
    };
 
    try {
      // Save to localStorage via StorageModule
      StorageModule.addDestination(newDestination);
      this.showSuccess();
 
      // setTimeout: delay redirect so user can see the success message (Week 3)
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
 
    } catch (err) {
      // try/catch: handle any unexpected storage errors
      console.error('Error saving destination:', err);
      this.showError('Something went wrong. Please try again.');
    }
  },
 
  // --- showError: displays a red error message on the form ---
  // DOM manipulation: updating className and style
  showError(message) {
    const el = document.getElementById('form-message');
    if (el) {
      el.textContent = message;
      el.className = 'form-message error';
      el.style.display = 'block';
    }
  },
 
  // --- showSuccess: displays a green success message ---
  showSuccess() {
    const el = document.getElementById('form-message');
    if (el) {
      el.textContent = '✓ Destination saved! Redirecting...';
      el.className = 'form-message success';
      el.style.display = 'block';
    }
  }
 
};