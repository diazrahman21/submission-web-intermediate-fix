import api from '../../data/api.js';

/**
 * Handles user registration form presentation and submission
 */
export default class RegisterPresenter {
  /**
   * @param {Object} params
   * @param {HTMLFormElement} params.form - The registration form element
   * @param {HTMLElement} params.messageDiv - Element to display status messages
   */
  constructor({ form, messageDiv }) {
    this.form = form;
    this.messageDiv = messageDiv;
  }

  /**
   * Initialize form event handlers
   */
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  async handleSubmit(e) {
    e.preventDefault();
    this.messageDiv.textContent = 'Loading...';

    // Get form input values
    const name = this.form.querySelector('#name').value;
    const email = this.form.querySelector('#email').value;
    const password = this.form.querySelector('#password').value;

    try {
      const result = await api.register({ name, email, password });
      if (!result.error) {
        this.messageDiv.style.color = '#16a34a'; // Success green
        this.messageDiv.textContent = 'Registration successful! Redirecting to login page...';
        setTimeout(() => {
          window.location.hash = '/';
        }, 1200); // Wait 1.2s before redirect to show success message
      } else {
        this.messageDiv.style.color = '#e11d48'; // Error red
        this.messageDiv.textContent = result.message || 'Registration failed!';
      }
    } catch {
      this.messageDiv.style.color = '#e11d48'; // Error red
      this.messageDiv.textContent = 'An error occurred. Please try again.';
    }
  }
}