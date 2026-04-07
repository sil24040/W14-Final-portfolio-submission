const DisplayModule = {
 
  // --- Closure example ---
  // currentFilter is enclosed in this module object and remembered
  // between calls — this is a practical use of closure/scope
  currentFilter: 'all',
 
  // --- init: sets up the page ---
  // async because render() needs to await data from storage
  async init() {
    await this.render();
    this.bindFilterTabs();
 
    // Callback: the arrow function is a callback passed to addEventListener
    document.getElementById('search-input')?.addEventListener('input', () => this.render());
  },
 
  // --- render: builds the destination list ---
  async render() {
    // await pauses until loadDestinations resolves
    const destinations = await StorageModule.loadDestinations();
    const search = document.getElementById('search-input')?.value.toLowerCase() || '';
 
    // Higher-order function: .filter() with a callback to narrow results
    let filtered = destinations;
 
    if (this.currentFilter === 'planned') {
      filtered = destinations.filter(d => !d.visited);
    } else if (this.currentFilter === 'visited') {
      filtered = destinations.filter(d => d.visited);
    }
 
    // Higher-order function: chained .filter() for search
    if (search) {
      filtered = filtered.filter(d =>
        d.city.toLowerCase().includes(search) ||
        d.country.toLowerCase().includes(search)
      );
    }
 
    // DOM manipulation: get references to elements
    const container = document.getElementById('destinations-list');
    const emptyState = document.getElementById('empty-state');
 
    if (!container) return;
 
    if (filtered.length === 0) {
      container.innerHTML = '';
      // DOM manipulation: change display style directly
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }
 
    if (emptyState) emptyState.style.display = 'none';
 
    // Higher-order function: .map() transforms each destination into an HTML string
    // Template literals build dynamic HTML from data
    container.innerHTML = filtered.map(dest => this.renderCard(dest)).join('');
 
    // Higher-order function: .forEach() with a callback to bind delete buttons
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Callback: handles the click event
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm('Remove this destination?')) {
          StorageModule.deleteDestination(id);
          this.render(); // re-render after deletion
        }
      });
    });
  },
 
  // --- renderCard: returns HTML string for one destination ---
  // Template literals allow embedded expressions inside HTML strings
  renderCard(dest) {
    const emoji = this.getEmoji(dest.country);
    const badge = dest.visited
      ? '<span class="badge badge-visited">Visited</span>'
      : '<span class="badge badge-planned">Planned</span>';
 
    // Ternary operator for conditional date display
    const date = dest.plannedDate
      ? `<span class="dest-date">${this.formatDate(dest.plannedDate)}</span>`
      : '';
 
    return `
      <div class="dest-card" onclick="window.location.href='details.html?id=${dest.id}'">
        <div class="dest-icon">${emoji}</div>
        <div class="dest-info">
          <div class="dest-name">${dest.city}</div>
          <div class="dest-country">${dest.country} ${date}</div>
        </div>
        <div class="dest-actions">
          ${badge}
          <button class="delete-btn" data-id="${dest.id}" title="Remove">✕</button>
        </div>
      </div>
    `;
  },
 
  // --- bindFilterTabs: attaches click events to the tab buttons ---
  // Demonstrates callbacks and DOM manipulation together
  bindFilterTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      // Callback function passed to addEventListener
      btn.addEventListener('click', () => {
        // DOM manipulation: remove active class from all, add to clicked
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
 
        // Update the closure variable — this persists between renders
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });
  },
 
  // --- formatDate: converts '2025-06' to '· Jun 2025' ---
  formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `· ${months[parseInt(month) - 1]} ${year}`;
  },
 
  // --- getEmoji: maps country name to a relevant emoji ---
  // Rest/spread concept: object literal used as a lookup map
  getEmoji(country) {
    const map = {
      'France': '🗼', 'Japan': '🌸', 'Italy': '🏛️', 'USA': '🗽',
      'South Africa': '🦁', 'Australia': '🦘', 'Brazil': '🌴',
      'Spain': '💃', 'Greece': '🏺', 'Thailand': '🐘',
      'Mexico': '🌮', 'India': '🕌', 'Egypt': '🐫', 'Peru': '🦙',
      'Portugal': '🐟', 'Morocco': '🕌', 'Iceland': '🌋',
      'New Zealand': '🥝', 'Canada': '🍁', 'UK': '☂️'
    };
    // Return matching emoji or default travel emoji
    return map[country] || '✈️';
  }
 
};