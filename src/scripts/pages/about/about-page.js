import AboutPresenter from './about-presenter';

export default class AboutPage {
  async render() {
    return `
      <section class="about-section" style="max-width:420px;margin:40px auto 32px auto;padding:28px 18px 24px 18px;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(26,35,126,0.10),0 1.5px 4px rgba(26,35,126,0.08);">
        <h2 style="text-align:center;color:#1976d2;margin-bottom:18px;letter-spacing:1px;">About This Website</h2>
        <div class="about-icons" style="display:flex;align-items:center;gap:16px;margin-bottom:18px;justify-content:center;">
          <img class="about-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" title="JavaScript" style="width:32px;height:32px;">
          <img class="about-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" alt="Node.js" title="Node.js" style="width:32px;height:32px;">
          <img class="about-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-plain.svg" alt="Webpack" title="Webpack" style="width:32px;height:32px;">
          <img class="about-icon" src="https://unpkg.com/leaflet@1.9.4/dist/images/logo.svg" alt="Leaflet" title="Leaflet" style="width:32px;height:32px;">
        </div>
        <p style="font-size:1.08rem;color:#374151;line-height:1.7;text-align:center;">
          This website was designed and developed by <b>Muh Diaz Nazarudin Rahman</b>, a <b>Fullstack Developer</b> focused on building modern, interactive, and responsive web applications.<br><br>
          Built using <b>JavaScript</b>, <b>Node.js</b>, <b>Webpack</b>, and <b>Leaflet</b> for interactive maps, this website emphasizes performance, security, and optimal user experience across devices.
        </p>
        <div style="margin-top:22px;text-align:center;">
          <span style="color:#1976d2;font-weight:600;font-size:1.05rem;">Thank you for visiting!</span>
        </div>
      </section>
    `;
  }

  async afterRender() {
    new AboutPresenter().init();
  }
}
