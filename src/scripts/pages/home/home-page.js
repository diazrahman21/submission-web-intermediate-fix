import AddStoryPresenter from '../add-story/add-story-presenter.js';
import api from '../../data/api.js';

export default class HomePage {
  constructor() {
    this.storiesList = null;
    this.mapOptions = {
      center: [ -6.200000, 106.816666 ], // Default: Jakarta
      zoom: 5,
      tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    };
  }

  render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
        <div id="main-content" class="main-content"></div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('token');

    // Add "Add Story" button above the list
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="add-story-home-wrapper">
        <button id="show-add-story" class="add-story-btn-home">+ Add Story</button>
      </div>
      <div id="stories-list" class="stories-list"></div>
    `;

    this.storiesList = document.getElementById('stories-list');
    this.storiesList.innerHTML = 'Loading...';

    if (!token) {
      this.storiesList.innerHTML = '<p>You are not logged in. Please log in first.</p>';
      return;
    }

    try {
      const result = await api.getStories({ token });
      if (!result.error && Array.isArray(result.listStory)) {
        if (result.listStory.length === 0) {
          this.storiesList.innerHTML = '<p>No stories available.</p>';
        } else {
          this.storiesList.innerHTML = '';
          result.listStory.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            storyCard.innerHTML = `
              <img src="${story.photoUrl}" alt="${story.name}" class="story-img" />
              <div class="story-content">
                <h3>${story.name}</h3>
                <p>${story.description}</p>
                <span class="story-date">${new Date(story.createdAt).toLocaleString()}</span>
                <a href="#/detail/${story.id}" class="detail-btn">View Detail</a>
              </div>
            `;
            this.storiesList.appendChild(storyCard);
          });
        }
      } else {
        this.storiesList.innerHTML = `<p>Failed to load stories: ${result.message || 'Unknown error'}</p>`;
      }
    } catch (err) {
      this.storiesList.innerHTML = '<p>An error occurred while loading stories.</p>';
    }

    // Event: show add story form when button is clicked
    document.getElementById('show-add-story').addEventListener('click', () => {
      const presenter = new AddStoryPresenter({
        container: mainContent,
        api,
        mapOptions: this.mapOptions // Pass map options to presenter
      });
      presenter.renderForm();
    });
  }
}
