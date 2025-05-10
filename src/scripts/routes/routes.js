import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import DetailPage from '../pages/detail/detail-page';

const routes = {
  '/': new HomePage(), // Ubah dari LoginPage ke HomePage
  '/login': new LoginPage(), // Tambahkan route login eksplisit
  '/register': new RegisterPage(),
  '/home': new HomePage(),
  '/about': new AboutPage(),
  '/detail/:id': new DetailPage(),
};

export default routes;
