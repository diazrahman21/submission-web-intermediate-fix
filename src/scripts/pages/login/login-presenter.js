import api from '../../data/api.js';

export default class LoginPresenter {
  constructor({ form, messageDiv }) {
    this.form = form;
    this.messageDiv = messageDiv;
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.messageDiv.textContent = 'Loading...';

    const email = this.form.querySelector('#email').value;
    const password = this.form.querySelector('#password').value;

    try {
      const result = await api.login({ email, password });
      if (!result.error) {
        this.messageDiv.style.color = '#16a34a';
        this.messageDiv.textContent = 'Login successful! Redirecting to home page...';
        localStorage.setItem('token', result.loginResult.token);
        setTimeout(() => {
          window.location.hash = '/home';
        }, 1000);
      } else {
        this.messageDiv.style.color = '#e11d48';
        this.messageDiv.textContent = result.message || 'Login failed!';
      }
    } catch {
      this.messageDiv.style.color = '#e11d48';
      this.messageDiv.textContent = 'An error occurred. Please try again.';
    }
  }
}