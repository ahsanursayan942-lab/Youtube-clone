class Video {
  constructor(data) {
    this.data = data;
  }

  generateHTML() {
    return `
      <div class="video-preview">
        <div class="thumbnail-row">
          <a href="${this.data.videoLink}">
            <img class="thumbnail" src="${this.data.thumbnail}" loading="lazy" alt="Thumbnail">
          </a>
          <div class="video-time">${this.data.videoTime}</div>
        </div>

        <div class="video-info-grid">
          <div class="channel-pictures">
            <a href="${this.data.channelLink}">
              <img class="profile-picture" src="${this.data.profilePic}" alt="Channel Profile">
            </a>
          </div>

          <div class="video-info">
            <p class="video-title">${this.data.title}</p>
            <p class="video-author">${this.data.author}</p>
            <p class="video-stats">${this.data.views} views · ${this.data.posted}</p>
          </div>
        </div>
      </div>
    `;
  }
}

class YouTubeApp {
  constructor(containerSelector, dataSource) {
    this.container = document.querySelector(containerSelector);
    this.dataSource = dataSource;
    this.allVideos = []; // Stores the full list for filtering
  }

  async start() {
    try {
      const response = await fetch(this.dataSource);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Save to this.allVideos so we can filter later
      this.allVideos = await response.json();
      this.renderAll(this.allVideos);
      
    } catch (error) {
      this.handleError(error);
    }
  }

  // New method: Filters the list and re-renders
  filterVideos(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    const filtered = this.allVideos.filter(video => {
      return video.title.toLowerCase().includes(term) || 
             video.author.toLowerCase().includes(term);
    });

    this.renderAll(filtered);
  }

  renderAll(videos) {
    if (!this.container) return;

    if (videos.length === 0) {
      this.container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding-top: 20px;">No videos found.</p>`;
      return;
    }

    const htmlContent = videos
      .map(videoData => new Video(videoData).generateHTML())
      .join('');

    this.container.innerHTML = htmlContent;
  }

  handleError(error) {
    console.error("Failed to load YouTube content:", error);
    if (this.container) {
      this.container.innerHTML = `
        <div class="error-message">
          <p>Unable to load videos right now. Please check your connection.</p>
        </div>
      `;
    }
  }
}

// Initialize and run the application
// We save it to 'window.youtubeGrid' so header.js can find it
window.youtubeGrid = new YouTubeApp('.video-grid', 'videos.json');
window.youtubeGrid.start();