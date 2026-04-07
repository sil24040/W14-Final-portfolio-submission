const DetailsModule = {
 
  // Stores the current destination — scoped to this module (closure)
  destination: null,
 
  // --- init: entry point for the details page ---
  async init() {
 
    // Web API: URLSearchParams reads the ?id= from the URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
 
    // Redirect if no id is provided
    if (!id) {
      window.location.href = 'index.html';
      return;
    }
 
    // async/await: wait for localStorage data to load before continuing
    await StorageModule.loadDestinations();
 
    // Look up the destination by the id from the URL
    this.destination = StorageModule.getDestinationById(id);
 
    // Redirect if destination not found
    if (!this.destination) {
      window.location.href = 'index.html';
      return;
    }
 
    // Render page and bind events
    this.render();
    this.bindEvents();
 
    // Call the Weather module to fetch live weather for this city
    WeatherModule.fetchWeather(this.destination.city, this.destination.country);
  },
 
  // --- render: updates the DOM with destination data ---
  // DOM manipulation: setting textContent on multiple elements
  render() {
    const d = this.destination;
 
    // DOM manipulation: update text content of each element
    document.getElementById('dest-city').textContent = d.city;
    document.getElementById('dest-country').textContent = d.country;
    document.getElementById('dest-notes').textContent = d.notes || 'No notes added yet.';
 
    // Ternary: show formatted date or fallback text
    document.getElementById('dest-date').textContent = d.plannedDate
      ? this.formatDate(d.plannedDate)
      : 'No date set';
 
    // DOM manipulation: update badge text and class based on visited status
    const statusBadge = document.getElementById('dest-status');
    if (statusBadge) {
      statusBadge.textContent = d.visited ? 'Visited' : 'Planned';
      // Template literal to build the class string dynamically
      statusBadge.className = `badge ${d.visited ? 'badge-visited' : 'badge-planned'}`;
    }
 
    // Update the toggle button label based on current status
    const visitBtn = document.getElementById('toggle-visited-btn');
    if (visitBtn) {
      visitBtn.textContent = d.visited ? 'Mark as Planned' : 'Mark as Visited ✓';
      visitBtn.className = d.visited ? 'btn btn-secondary' : 'btn btn-primary';
    }
 
    // Use DisplayModule's getEmoji helper (module reuse)
    document.getElementById('dest-emoji').textContent = DisplayModule.getEmoji(d.country);
  },
 
  // --- bindEvents: attaches click handlers to buttons ---
  // Demonstrates callbacks passed to addEventListener
  bindEvents() {
 
    // Back button callback
    document.getElementById('back-btn')?.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
 
    // Toggle visited status and re-render
    document.getElementById('toggle-visited-btn')?.addEventListener('click', () => {
      // 'this' refers to DetailsModule — toggleVisited returns updated destination
      this.destination = StorageModule.toggleVisited(this.destination.id);
      this.render(); // re-render to reflect the change
    });
 
    // Delete destination and redirect home
    document.getElementById('delete-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove this destination?')) {
        StorageModule.deleteDestination(this.destination.id);
        window.location.href = 'index.html';
      }
    });
  },
 
  // --- formatDate: converts '2025-06' to 'June 2025' ---
  formatDate(dateStr) {
    const [year, month] = dateStr.split('-');
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  }
 
};
 