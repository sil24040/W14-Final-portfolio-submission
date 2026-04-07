const DestinationModule = {
 
  init() {
    const form = document.getElementById('add-form');
    if (!form) return;
 
    this.buildCountryDropdown();
 
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
 
    document.getElementById('cancel-btn')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  },
 
  // --- buildCountryDropdown: populates country select ---
  // Also reads sessionStorage to pre-select the country chosen on home page
  buildCountryDropdown() {
    const select = document.getElementById('country');
    if (!select || !DisplayModule.ALL_COUNTRIES) return;
 
    const options = DisplayModule.ALL_COUNTRIES.map(c =>
      `<option value="${c}">${c}</option>`
    ).join('');
 
    select.innerHTML = `<option value="">— Select a country —</option>${options}`;
 
    // sessionStorage: read country selected on home page and pre-select it
    const savedCountry = sessionStorage.getItem('selectedCountry');
    if (savedCountry && savedCountry !== 'all') {
      select.value = savedCountry;
    }
  },
 
  handleSubmit() {
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value;
    const plannedDate = document.getElementById('plannedDate').value;
    const notes = document.getElementById('notes').value.trim();
 
    if (!city || !country) {
      this.showError('Please enter a city and select a country.');
      return;
    }
 
    const newDestination = {
      ...{ city, country, plannedDate, notes },
      description: '',
      visited: false
    };
 
    try {
      StorageModule.addDestination(newDestination);
      // Clear the saved country after use
      sessionStorage.removeItem('selectedCountry');
      this.showSuccess();
 
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
 
    } catch (err) {
      console.error('Error saving destination:', err);
      this.showError('Something went wrong. Please try again.');
    }
  },
 
  showError(message) {
    const el = document.getElementById('form-message');
    if (el) {
      el.textContent = message;
      el.className = 'form-message error';
      el.style.display = 'block';
    }
  },
 
  showSuccess() {
    const el = document.getElementById('form-message');
    if (el) {
      el.textContent = '✓ Destination saved! Redirecting...';
      el.className = 'form-message success';
      el.style.display = 'block';
    }
  }
};