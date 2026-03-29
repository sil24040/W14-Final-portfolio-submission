// destinationModule.js — handles the add destination form on add.html

const DestinationModule = {

    init() {
      const form = document.getElementById('add-form');
      if (!form) return;
  
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
  
      document.getElementById('cancel-btn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    },
  
    handleSubmit() {
      const city = document.getElementById('city').value.trim();
      const country = document.getElementById('country').value.trim();
      const plannedDate = document.getElementById('plannedDate').value;
      const notes = document.getElementById('notes').value.trim();
  
      if (!city || !country) {
        this.showError('City and country are required.');
        return;
      }
  
      const newDestination = {
        city,
        country,
        plannedDate,
        notes,
        description: '',
        visited: false
      };
  
      StorageModule.addDestination(newDestination);
      this.showSuccess();
  
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
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