import RegisterPresenter from './register-presenter.js';

class RegisterPage {
  constructor() {
    this.presenter = null;
  }

  render() {
    return `
      <section class="register-section">
        <h2>Register</h2>
        <form id="registerForm">
          <label for="name">Name:</label>
          <input type="text" id="name" required />
          <br />
          <label for="email">Email:</label>
          <input type="email" id="email" required />
          <br />
          <label for="password">Password:</label>
          <input type="password" id="password" required minlength="8" />
          <br />
          <button type="submit">Register</button>
        </form>
        <div id="register-message"></div>
      </section>
    `;
  }

  afterRender() {
    const form = document.getElementById('registerForm');
    const messageDiv = document.getElementById('register-message');
    this.presenter = new RegisterPresenter({ form, messageDiv });
    this.presenter.init();
  }
}

export default RegisterPage;