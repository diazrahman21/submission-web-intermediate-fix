import CONFIG from '../config';

const api = {
  async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async addStory({ description, photo, lat, lon, token }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat !== undefined && lat !== null) formData.append('lat', lat);
    if (lon !== undefined && lon !== null) formData.append('lon', lon);

    const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.ADD_STORY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan tambahkan Content-Type, biarkan browser set multipart/form-data
      },
      body: formData,
    });
    return response.json();
  },

  async getStories({ token, page, size, location }) {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page);
    if (size !== undefined) params.append('size', size);
    if (location !== undefined) params.append('location', location);

    const url = params.toString()
      ? `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.STORIES}?${params.toString()}`
      : `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.STORIES}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async getStoryDetail({ id, token }) {
    const response = await fetch(
      `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.STORIES}/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.json();
  },

  async subscribe({ token, endpoint, keys }) {
    const response = await fetch(`${CONFIG.BASE_URL}/subscribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint, keys }),
    });
    return response.json();
  },

  async unsubscribe({ token, endpoint }) {
    const response = await fetch(`${CONFIG.BASE_URL}/subscribe`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });
    return response.json();
  },
};

export default api;