// detailsModule.js — handles the destination details page

const DetailsModule = {

    destination: null,
  
    async init() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
  
      if (!id) {
        window.location.href = 'index.html';
        return;
      }
  
      await StorageModule.loadDestinations();
      this.destination = StorageModule.getDestinationById(id);
  
      if (!this.destination) {
        window.location.href = 'index.html';
        return;
      }
  
      this.render();
      this.bindEvents();
      WeatherModule.fetchWeather(this.destination.city, this.destination.country);
    },
  
    render() {
      const d = this.destination;
  
      document.getElementById('dest-city').textContent = d.city;
      document.getElementById('dest-country').textContent = d.country;
      document.getElementById('dest-notes').textContent = d.notes || 'No notes added yet.';
      document.getElementById('dest-date').textContent = d.plannedDate
        ? this.formatDate(d.plannedDate)
        : 'No date set';
  
      const statusBadge = document.getElementById('dest-status');
      if (statusBadge) {
        statusBadge.textContent = d.visited ? 'Visited' : 'Planned';
        statusBadge.className = `badge ${d.visited ? 'badge-visited' : 'badge-planned'}`;
      }
  
      const visitBtn = document.getElementById('toggle-visited-btn');
      if (visitBtn) {
        visitBtn.textContent = d.visited ? 'Mark as Planned' : 'Mark as Visited ✓';
        visitBtn.className = d.visited ? 'btn btn-secondary' : 'btn btn-primary';
      }
  
      document.getElementById('dest-emoji').textContent = DisplayModule.getEmoji(d.country);
    },
  
    bindEvents() {
      document.getElementById('back-btn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
  
      document.getElementById('toggle-visited-btn')?.addEventListener('click', () => {
        this.destination = StorageModule.toggleVisited(this.destination.id);
        this.render();
      });
  
      document.getElementById('delete-btn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this destination?')) {
          StorageModule.deleteDestination(this.destination.id);
          window.location.href = 'index.html';
        }
      });
    },
  
    formatDate(dateStr) {
      const [year, month] = dateStr.split('-');
      const months = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
      return `${months[parseInt(month) - 1]} ${year}`;
    }
  };