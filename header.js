class Header {
  constructor(headerData) {
    this.data = headerData;
  }

  generateHTML() {
    return `
      <div class="left-section">
        <img class="hamburger-menu" src="hamburger-menu.svg" alt="Menu">
        <img class="youtube-logo" src="${this.data.logo}" alt="YouTube Logo">
      </div>

      <div class="middle-section">
        <input class="search-bar" type="text" placeholder="Search" aria-label="Search">
        <button class="search-button">
          <img class="search-icon" src="search.svg" alt="Search">
          <span class="tooltip">Search</span>
        </button>
        <button class="voice-search-button">
          <img class="voice-search-icon" src="voice-search-icon.svg" alt="Voice Search">
          <span class="tooltip">Search with voice</span>
        </button>
      </div>

      <div class="right-section">
        <div class="upload-icon-container">
          <img class="upload-icon" src="upload.svg" alt="Create">
          <span class="tooltip">Create</span>
        </div>
        <div class="youtube-app-icon-container">
          <img class="youtube-app-icon" src="youtube-apps.svg" alt="Apps">
          <span class="tooltip">YouTube Apps</span>
        </div>
        <div class="notification-icon-container">
          <img class="notification-icon" src="notifications.svg" alt="Notifications">
          <span class="notification-count">${this.data.notifications}</span>
          <span class="tooltip">Notifications</span>
        </div>
        <img class="channel-pic-icon" src="${this.data.profilePicture}" alt="Profile" id="theme-toggle" style="cursor: pointer;">
      </div>
    `;
  }
}

class HeaderApp {
  async init() {
    try {
      const response = await fetch('header.json');
      const data = await response.json();
      
      const headerInstance = new Header(data);
      const container = document.querySelector('.header');
      container.innerHTML = headerInstance.generateHTML();

      this.setupSearch(container);
      this.setupThemeToggle(container); // New logic
    } catch (error) {
      console.error("Error loading header:", error);
    }
  }

  setupSearch(container) {
    const searchInput = container.querySelector('.search-bar');
    const searchButton = container.querySelector('.search-button');

    searchButton.addEventListener('click', () => {
      this.performSearch(searchInput.value);
    });

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.performSearch(searchInput.value);
      }
    });
  }

  setupThemeToggle(container) {
    const toggleBtn = container.querySelector('#theme-toggle');
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
    });
  }

  performSearch(query) {
    const term = query.toLowerCase().trim();
    if (window.youtubeGrid) { // Match the instance name in your youtube.js
      window.youtubeGrid.filterVideos(term);
    }
  }
}

const myHeader = new HeaderApp();
myHeader.init();