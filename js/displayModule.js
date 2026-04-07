const DisplayModule = {
 
  currentFilter: 'all',
  currentCountry: 'all',
 
  ALL_COUNTRIES: [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda',
    'Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain',
    'Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
    'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
    'Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada',
    'Central African Republic','Chad','Chile','China','Colombia','Comoros',
    'Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark',
    'Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador',
    'Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji',
    'Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece',
    'Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras',
    'Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel',
    'Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
    'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya',
    'Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia',
    'Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius',
    'Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco',
    'Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand',
    'Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman',
    'Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru',
    'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
    'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
    'Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal',
    'Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
    'Solomon Islands','Somalia','South Africa','South Korea','South Sudan',
    'Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
    'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
    'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda',
    'Ukraine','United Arab Emirates','United Kingdom','USA','Uruguay',
    'Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen',
    'Zambia','Zimbabwe',
    'Hawaii','Alaska','California','Florida','New York State','Texas','Colorado',
    'England','Scotland','Wales','Northern Ireland'
  ].sort(),
 
  async init() {
    await this.render();
    this.bindFilterTabs();
    this.buildCountryDropdown();
 
    // Search input — fires on every keystroke and re-renders
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.render();
      });
    }
 
    // Country dropdown — fires when selection changes
    const countryFilter = document.getElementById('country-filter');
    if (countryFilter) {
      countryFilter.addEventListener('change', (e) => {
        this.currentCountry = e.target.value;
        // Save selected country to sessionStorage so Add page can read it
        sessionStorage.setItem('selectedCountry', this.currentCountry);
        this.render();
      });
    }
 
    // Update Add button link to pass selected country
    const addBtn = document.querySelector('a[href="add.html"]');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        // Save current country selection before navigating
        sessionStorage.setItem('selectedCountry', this.currentCountry);
      });
    }
  },
 
  buildCountryDropdown() {
    const select = document.getElementById('country-filter');
    if (!select) return;
 
    const options = this.ALL_COUNTRIES.map(c =>
      `<option value="${c}">${c}</option>`
    ).join('');
 
    select.innerHTML = `<option value="all">🌍 All Countries</option>${options}`;
    select.value = this.currentCountry;
  },
 
  async render() {
    const destinations = await StorageModule.loadDestinations();
 
    // Read search value directly each time render is called
    const searchInput = document.getElementById('search-input');
    const search = searchInput ? searchInput.value.toLowerCase() : '';
 
    let filtered = destinations;
 
    // Filter by tab (all/planned/visited)
    if (this.currentFilter === 'planned') {
      filtered = destinations.filter(d => !d.visited);
    } else if (this.currentFilter === 'visited') {
      filtered = destinations.filter(d => d.visited);
    }
 
    // Filter by country dropdown
    if (this.currentCountry !== 'all') {
      filtered = filtered.filter(d => d.country === this.currentCountry);
    }
 
    // Filter by search text
    if (search) {
      filtered = filtered.filter(d =>
        d.city.toLowerCase().includes(search) ||
        d.country.toLowerCase().includes(search)
      );
    }
 
    const container = document.getElementById('destinations-list');
    const emptyState = document.getElementById('empty-state');
 
    if (!container) return;
 
    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }
 
    if (emptyState) emptyState.style.display = 'none';
 
    container.innerHTML = filtered.map(dest => this.renderCard(dest)).join('');
 
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
      'New Zealand': '🥝', 'Canada': '🍁', 'United Kingdom': '☂️',
      'England': '🏰', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Ireland': '🍀',
      'Hawaii': '🌺', 'Germany': '🍺', 'China': '🐉',
      'South Korea': '🎎', 'Turkey': '🕌', 'Russia': '🪆',
      'Netherlands': '🌷', 'Switzerland': '🏔️', 'Norway': '🌊',
      'Sweden': '🫎', 'Denmark': '🧜', 'Finland': '🦌',
      'Saudi Arabia': '🕌', 'United Arab Emirates': '🏙️',
      'Singapore': '🦁', 'Philippines': '🌺', 'Indonesia': '🏝️',
      'Vietnam': '🍜', 'Cambodia': '🏯', 'Nepal': '🏔️',
      'Kenya': '🦒', 'Tanzania': '🦓', 'Nigeria': '🥁',
      'Argentina': '🥩', 'Chile': '🌶️', 'Colombia': '🌸',
      'Cuba': '🎵', 'Jamaica': '🎶', 'Costa Rica': '🦜'
    };
    return map[country] || '✈️';
  }
};
 