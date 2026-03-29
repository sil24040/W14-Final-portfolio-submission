// visitedModule.js — handles the visited destinations page

const VisitedModule = {

    async init() {
      await this.render();
    },
  
    async render() {
      const all = await StorageModule.loadDestinations();
      const visited = all.filter(d => d.visited);
  
      const container = document.getElementById('visited-list');
      const countEl = document.getElementById('visited-count');
      const emptyState = document.getElementById('empty-state');
  
      if (countEl) {
        countEl.textContent = `${visited.length} destination${visited.length !== 1 ? 's' : ''} visited`;
      }
  
      if (!container) return;
  
      if (visited.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
      }
  
      if (emptyState) emptyState.style.display = 'none';
  
      container.innerHTML = visited.map(dest => this.renderCard(dest)).join('');
  
      container.querySelectorAll('.card-link').forEach(card => {
        card.addEventListener('click', () => {
          window.location.href = `details.html?id=${card.dataset.id}`;
        });
      });
    },
  
    renderCard(dest) {
      const emoji = DisplayModule.getEmoji(dest.country);
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
  
    formatDate(dateStr) {
      const [year, month] = dateStr.split('-');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${months[parseInt(month) - 1]} ${year}`;
    }
  };