import DetailPresenter from './detail-presenter.js';

export default class DetailPage {
  constructor() {
    this.storyId = null;
    this.presenter = null;
  }

  render() {
    // Get ID from hash, example: #/detail/:id
    const hash = window.location.hash;
    const parts = hash.split('/');
    this.storyId = parts[2] || '';
    return `
      <section class="detail-section">
        <h2>Detail Story</h2>
        <div id="story-detail" class="story-detail-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const detailContainer = document.getElementById('story-detail');
    this.presenter = new DetailPresenter({
      storyId: this.storyId,
      container: detailContainer,
    });
    await this.presenter.showDetail();

    // Get lat/lng data from element rendered by presenter
    // Example: <span id="story-location" data-latitude="..." data-longitude="..."></span>
    const locElem = detailContainer.querySelector('[data-latitude][data-longitude]');
    if (locElem) {
      const latitude = locElem.getAttribute('data-latitude');
      const longitude = locElem.getAttribute('data-longitude');
      if (latitude && longitude) {
        // Check if map exists, if not add it
        if (!detailContainer.querySelector('.story-detail-map')) {
          const mapDiv = document.createElement('div');
          mapDiv.className = 'story-detail-map';
          mapDiv.innerHTML = `
            <iframe
              width="100%"
              height="220"
              frameborder="0"
              style="border:0; border-radius:12px;"
              src="https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed"
              allowfullscreen>
            </iframe>
          `;
          detailContainer.appendChild(mapDiv);
        }
      }
    }
  }
}