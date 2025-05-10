// Atur path icon Leaflet agar marker muncul
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default class AboutPresenter {
  init() {
    // Animasi icon: scale dan rotate saat muncul
    const icons = document.querySelectorAll('.about-icon');
    icons.forEach((icon, i) => {
      icon.style.opacity = '0';
      icon.style.transform = 'scale(0.5) rotate(-30deg)';
      setTimeout(() => {
        icon.style.transition = 'all 0.6s cubic-bezier(.4,2,.3,1)';
        icon.style.opacity = '1';
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 200 + i * 180);
      // Hover animasi
      icon.addEventListener('mouseenter', () => {
        icon.style.transition = 'transform 0.25s cubic-bezier(.4,2,.3,1)';
        icon.style.transform = 'scale(1.18) rotate(8deg)';
      });
      icon.addEventListener('mouseleave', () => {
        icon.style.transition = 'transform 0.25s cubic-bezier(.4,2,.3,1)';
        icon.style.transform = 'scale(1) rotate(0deg)';
      });
    });

    // Kriteria Opsional 1: Tambahkan icon Font Awesome pada caption
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection && !aboutSection.querySelector('.about-extra')) {
      const extra = document.createElement('div');
      extra.className = 'about-extra';
      extra.style.marginTop = '28px';
      extra.style.textAlign = 'center';
     
      aboutSection.appendChild(extra);
    }
  }
}