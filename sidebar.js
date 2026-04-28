class Sidebar {
  constructor(links) {
    this.links = links;
  }

  generateHTML() {
    return this.links.map((link, index) => `
      <a class="sidebar-link ${index === 0 ? 'active' : ''}" href="${link.link}">
        <img src="${link.icon}" alt="${link.name}">
        <span>${link.name}</span>
      </a>
    `).join('');
  }
}

class SidebarApp {
  async init() {
    try {
      const response = await fetch('sidebar.json');
      const data = await response.json();
      const sidebar = new Sidebar(data);
      const container = document.querySelector('.sidebar');
      container.innerHTML = sidebar.generateHTML();

      this.setupActiveLinks(container); // New logic
    } catch (error) {
      console.error("Sidebar loading failed:", error);
    }
  }

  setupActiveLinks(container) {
    const links = container.querySelectorAll('.sidebar-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // Keeps page from refreshing
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }
}

new SidebarApp().init();