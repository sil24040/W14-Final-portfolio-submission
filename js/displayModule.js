const DisplayModule = {
 
  currentFilter: 'all',
  currentCountry: 'all', // closure variable for country dropdown
 
  async init() {
    await this.render();
    this.bindFilterTabs();
    await this.buildCountryDropdown();
 
    // Callback on search input
    document.getElementById('search-input')?.addEventListener('input', () => this.render());
 
    // Callback on country dropdown change
    document.getElementById('country-filter')?.addEventListener('change', (e) => {
      this.currentCountry = e.target.value;
      this.render();
    });
  },
 
  // --- buildCountryDropdown: dynamically builds the country filter ---
  // ES6 Set automatically removes duplicates — each country appears only once
  async buildCountryDropdown() {
    const destinations = await StorageModule.loadDestinations();
    const select = document.getElementById('country-filter');
    if (!select) return;
 
    // Spread syntax converts Set back to array, .sort() alphabetizes
    const countries = [...new Set(destinations.map(d => d.country))].sort();
 
    // .map() builds <option> elements, DOM manipulation inserts them
    const options = countries.map(c => `<option value="${c}">${c}</option>`).join('');
    select.innerHTML = `<option value="all">All Countries</option>${options}`;
 
    // Restore previously selected country after rebuild
    select.value = this.currentCountry;
  },
 
  async render() {
    const destinations = await StorageModule.loadDestinations();
    const search = document.getElementById('search-input')?.value.toLowerCase() || '';
 
    // Higher-order function: .filter() for visited/planned tab
    let filtered = destinations;
    if (this.currentFilter === 'planned') {
      filtered = destinations.filter(d => !d.visited);
    } else if (this.currentFilter === 'visited') {
      filtered = destinations.filter(d => d.visited);
    }
 
    // Higher-order function: chained .filter() for country dropdown
    if (this.currentCountry !== 'all') {
      filtered = filtered.filter(d => d.country === this.currentCountry);
    }
 
    // Higher-order function: chained .filter() for search
    if (search) {
      filtered = filtered.filter(d =>
        d.city.toLowerCase().includes(search) ||
        d.country.toLowerCase().includes(search)
      );
    }
 
    // Rebuild dropdown to reflect any new destinations added
    await this.buildCountryDropdown();
 
    const container = document.getElementById('destinations-list');
    const emptyState = document.getElementById('empty-state');
 
    if (!container) return;
 
    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }
 
    if (emptyState) emptyState.style.display = 'none';
 
    // Higher-order function: .map() transforms destinations into HTML cards
    container.innerHTML = filtered.map(dest => this.renderCard(dest)).join('');
 
    // Higher-order function: .forEach() binds delete button callbacks
    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (confirm('Remove this destination?')) {
          StorageModule.deleteDestination(id);
          this.render();
        }
      });
    });
  },
 
  renderCard(dest) {
    const emoji = this.getEmoji(dest.country);
    const badge = dest.visited
      ? '<span class="badge badge-visited">Visited</span>'
      : '<span class="badge badge-planned">Planned</span>';
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
 
  bindFilterTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });
  },
 
  formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `· ${months[parseInt(month) - 1]} ${year}`;
  },
 
  getEmoji(country) {
    const map = {
      'France': '🗼', 'Japan': '🌸', 'Italy': '🏛️', 'USA': '🗽',
      'South Africa': '🦁', 'Australia': '🦘', 'Brazil': '🌴',
      'Spain': '💃', 'Greece': '🏺', 'Thailand': '🐘',
      'Mexico': '🌮', 'India': '🕌', 'Egypt': '🐫', 'Peru': '🦙',
      'Portugal': '🐟', 'Morocco': '🕌', 'Iceland': '🌋',
      'New Zealand': '🥝', 'Canada': '🍁', 'UK': '☂️',
      'Hawaii': '🌺', 'England': '🏰'
    };
    return map[country] || '✈️';
  }
 
};