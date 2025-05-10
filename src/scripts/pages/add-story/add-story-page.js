import AddStoryPresenter from './add-story-presenter.js';
import api from '../../data/api.js';

const AddStoryPage = {
  async render() {
    return `
      <div class="container">
        <div id="add-story-content"></div>
      </div>
    `;
  },

  async afterRender() {
    const container = document.getElementById('add-story-content');
    const presenter = new AddStoryPresenter({ container, api });
    presenter.renderForm();

    // Handle back button to return to previous page
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();
      });
    }
  }
};

export default AddStoryPage;