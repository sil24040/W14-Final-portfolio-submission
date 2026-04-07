const VisitedModule = {
 
  // --- init: entry point for visited.html ---
  async init() {
    await this.render();
  },
 
  // --- render: filters and displays only visited destinations ---
  async render() {
    // async/await: wait for all destinations to load from localStorage
    const all = await StorageModule.loadDestinations();
 
    // Higher-order function: .filter() with callback — keep only visited ones
    const visited = all.filter(d => d.visited);
 
    // DOM manipulation: get references to page elements
    const container = document.getElementById('visited-list');
    const countEl = document.getElementById('visited-count');
    const emptyState = document.getElementById('empty-state');
 
    // DOM manipulation: update the count badge
    if (countEl) {
      // Ternary for singular/plural grammar
      countEl.textContent = `${visited.length} destination${visited.length !== 1 ? 's' : ''} visited`;
    }
 
    if (!container) return;
 
    // Show empty state if no visited destinations exist
    if (visited.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }
 
    if (emptyState) emptyState.style.display = 'none';
 
    // Higher-order function: .map() transforms each destination into HTML
    // .join('') combines the array of strings into one HTML string
    container.innerHTML = visited.map(dest => this.renderCard(dest)).join('');
 
    // Higher-order function: .forEach() with callback to add click events
    container.querySelectorAll('.card-link').forEach(card => {
      card.addEventListener('click', () => {
        // Navigate to the details page for the clicked destination
        window.location.href = `details.html?id=${card.dataset.id}`;
      });
    });
  },
 
  // --- renderCard: returns HTML string for one visited destination ---
  // Template literal builds dynamic HTML from destination data
  renderCard(dest) {
    const emoji = DisplayModule.getEmoji(dest.country); // reuse from DisplayModule
    const date = dest.plannedDate ? this.formatDate(dest.plannedDate) : '';
 
    return `
      <div class="dest-card card-link" data-id="${dest.id}">
        <div class="dest-icon">${emoji}</div>
        <div class="dest-info">
          <div class="dest-name">${dest.city}</div>
          <div class="dest-country">${dest.country}${date ? ' · Visited ' + date : ''}</div>
        </div>
        <span class="badge badge-visited">Visited</span>
        <span class="arrow">›</span>
      </div>
    `;
  },
 
  // --- formatDate: converts '2024-03' to 'Mar 2024' ---
  formatDate(dateStr) {
    const [year, month] = dateStr.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  }
 
};