import LoginPresenter from './login-presenter.js';

class LoginPage {
  constructor() {
    this.presenter = null;
  }

  render() {
    return `
      <section class="login-section">
        <h2>Login</h2>
        <form id="loginForm">
          <label for="email">Email:</label>
          <input type="email" id="email" required />
          <br />
          <label for="password">Password:</label>
          <input type="password" id="password" required minlength="8" />
          <br />
          <button type="submit">Login</button>
        </form>
        <div id="message"></div>
        <p style="text-align:center;margin-top:12px;">
          Don't have an account? <a href="#/register">Register here</a>
        </p>
      </section>
    `;
  }

  afterRender() {
    const form = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    this.presenter = new LoginPresenter({ form, messageDiv });
    this.presenter.init();
  }
}

export default LoginPage;