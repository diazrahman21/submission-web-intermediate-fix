import api from '../../data/api.js';

export default class DetailPresenter {
  constructor({ storyId, container }) {
    this.storyId = storyId;
    this.container = container;
  }

  async showDetail() {
    const token = localStorage.getItem('token');
    this.container.innerHTML = 'Loading...';

    if (!token) {
      this.container.innerHTML = '<p>You are not logged in. Please login first.</p>';
      return;
    }
    if (!this.storyId) {
      this.container.innerHTML = '<p>Story not found.</p>';
      return;
    }

    try {
      const result = await api.getStoryDetail({ id: this.storyId, token });
      if (!result.error && result.story) {
        const story = result.story;
        // Prepare maps HTML if lat/lon exists
        let mapHtml = '';
        if (story.lat && story.lon) {
          mapHtml = `
            <div class="story-detail-map">
              <iframe
                width="100%"
                height="220"
                frameborder="0"
                style="border:0; border-radius:12px;"
                src="https://www.google.com/maps?q=${story.lat},${story.lon}&hl=es;z=14&output=embed"
                allowfullscreen>
              </iframe>
            </div>
          `;
        }

        this.container.innerHTML = `
          <div class="story-detail-card">
            <img src="${story.photoUrl}" alt="${story.name}" class="story-detail-img" />
            <div class="story-detail-content">
              <h2>${story.name}</h2>
              <p class="story-detail-date">${new Date(story.createdAt).toLocaleString()}</p>
              <p class="story-detail-desc" style="margin-bottom:18px;">${story.description}</p>
              ${
                story.lat && story.lon
                  ? `
                    <div class="story-detail-location-group" style="margin-bottom:12px;">
                      <div class="story-detail-location" style="display:flex;align-items:center;gap:8px;">
                        <span>Location:</span>
                        <span style="font-family:monospace;">${story.lat}, ${story.lon}</span>
                        <span style="color:#1976d2; font-weight:500;">
                          (${story.placeName || story.name})
                        </span>
                      </div>
                      ${
                        story.address
                          ? `<div class="story-detail-address" style="margin-top:4px; color:#444;">${story.address}</div>`
                          : ''
                      }
                    </div>
                  `
                  : ''
              }
              ${mapHtml}
              <button id="back-to-detail" class="back-btn" style="margin-top:22px;">← Back</button>
            </div>
          </div>
        `;

        const backBtn = this.container.querySelector('#back-to-detail');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            window.history.back();
          });
        }
      } else {
        this.container.innerHTML = `<p>Failed to load story details: ${result.message || 'Unknown error'}</p>`;
      }
    } catch (err) {
      this.container.innerHTML = '<p>An error occurred while loading story details.</p>';
    }
  }
}