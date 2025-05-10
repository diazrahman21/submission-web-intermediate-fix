export default class AddStoryPresenter {
  constructor({ container, api }) {
    this.container = container;
    this.api = api;
  }

  renderForm() {
    this.container.innerHTML = `
      <section class="add-story-section">
        <button type="button" id="back-btn" class="back-btn" style="margin-bottom:18px;">
          <i class="fa fa-arrow-left"></i> Back
        </button>
        <h2>Add Story</h2>
        <form id="add-story-form" class="add-story-form" autocomplete="off">
          <label for="story-title">Title</label>
          <input type="text" id="story-title" name="title" required placeholder="Story title...">

          <label for="story-desc">Description</label>
          <textarea id="story-desc" name="description" required placeholder="Story description..."></textarea>

          <label for="story-photo">Photo (Camera/Gallery)</label>
          <input type="file" id="story-photo" name="photo" accept="image/*" capture="environment" required>
          <button type="button" id="open-camera-btn" class="camera-btn">Take Photo from Camera</button>
          <div id="camera-area" style="display:none; margin:10px 0;">
            <video id="camera-video" width="100%" autoplay playsinline style="border-radius:8px;"></video>
            <button type="button" id="capture-btn" class="camera-btn">Capture Photo</button>
            <button type="button" id="close-camera-btn" class="camera-btn">Close Camera</button>
          </div>
          <canvas id="camera-canvas" style="display:none;"></canvas>
          <img id="preview-img" class="preview-img" style="display:none; margin:10px 0; max-width:100%; border-radius:8px;"/>

          <label for="story-location">Select Location</label>
          <div id="map" class="story-map"></div>
          <input type="hidden" id="story-lat" name="lat">
          <input type="hidden" id="story-lng" name="lng">

          <button type="submit" class="add-story-btn">Add Story</button>
          <div id="add-story-message" class="add-story-message"></div>
        </form>
      </section>
    `;

    // Make sure event is attached after DOM is rendered
    setTimeout(() => {
      const backBtn = document.getElementById('back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          window.location.hash = '#/';
        });
      }
      this.initMap();
      this.initPreview();
      this.initCamera();
      this.initSubmit();
    }, 0);
  }

  initMap() {
    const mapOptions = this.mapOptions || {
      center: [ -6.200000, 106.816666 ],
      zoom: 5,
    };
    const tileLayers = this.tileLayers || {
      'OpenStreetMap': {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
      }
    };

    // Buat baseLayers untuk Leaflet
    const baseLayers = {};
    let firstLayer;
    Object.entries(tileLayers).forEach(([name, opt], idx) => {
      const layer = L.tileLayer(opt.url, { attribution: opt.attribution });
      baseLayers[name] = layer;
      if (idx === 0) firstLayer = layer;
    });

    this.map = L.map('map', {
      center: mapOptions.center,
      zoom: mapOptions.zoom,
      layers: [firstLayer]
    });

    L.control.layers(baseLayers).addTo(this.map);

    // Marker yang bisa digeser
    const marker = L.marker(mapOptions.center, { draggable: true }).addTo(this.map);

    document.getElementById('story-lat').value = mapOptions.center[0];
    document.getElementById('story-lng').value = mapOptions.center[1];

    marker.on('dragend', function(e) {
      const latlng = marker.getLatLng();
      document.getElementById('story-lat').value = latlng.lat;
      document.getElementById('story-lng').value = latlng.lng;
    });

    this.map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      document.getElementById('story-lat').value = e.latlng.lat;
      document.getElementById('story-lng').value = e.latlng.lng;
    });
  }

  initPreview() {
    const input = document.getElementById('story-photo');
    const preview = document.getElementById('preview-img');
    input.addEventListener('change', function() {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
      } else {
        preview.style.display = 'none';
      }
    });
  }

  initSubmit() {
    const form = document.getElementById('add-story-form');
    const message = document.getElementById('add-story-message');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';
      const title = document.getElementById('story-title').value;
      const description = document.getElementById('story-desc').value;
      const photo = document.getElementById('story-photo').files[0];
      const lat = document.getElementById('story-lat').value;
      const lon = document.getElementById('story-lng').value;
      const token = localStorage.getItem('token');

      try {
        const result = await this.api.addStory({
          description: `${title}\n${description}`,
          photo,
          lat,
          lon,
          token,
        });
        if (!result.error) {
          message.style.color = 'green';
          message.textContent = 'Story added successfully!';
          form.reset();
          document.getElementById('preview-img').style.display = 'none';
          // After success, redirect to all stories (homepage)
          setTimeout(() => {
            window.location.hash = '#/';
            window.location.reload();
          }, 1000);
        } else {
          message.style.color = 'red';
          message.textContent = result.message || 'Failed to add story.';
        }
      } catch (err) {
        message.style.color = 'red';
        message.textContent = 'An error occurred while submitting the story.';
      }
    });
  }

  initCamera() {
    const openBtn = document.getElementById('open-camera-btn');
    const cameraArea = document.getElementById('camera-area');
    const video = document.getElementById('camera-video');
    const captureBtn = document.getElementById('capture-btn');
    const closeBtn = document.getElementById('close-camera-btn');
    const canvas = document.getElementById('camera-canvas');
    const preview = document.getElementById('preview-img');
    const fileInput = document.getElementById('story-photo');
    let stream = null;

    openBtn.addEventListener('click', async () => {
      cameraArea.style.display = 'block';
      openBtn.style.display = 'none';
      fileInput.disabled = true;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
      } catch (err) {
        alert('Cannot access camera: ' + err.message);
        cameraArea.style.display = 'none';
        openBtn.style.display = '';
        fileInput.disabled = false;
      }
    });

    captureBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        // Manually set blob to file input
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        // Preview
        preview.src = URL.createObjectURL(blob);
        preview.style.display = 'block';
      }, 'image/jpeg', 0.95);
      // Close camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cameraArea.style.display = 'none';
      openBtn.style.display = '';
      fileInput.disabled = false;
    });

    closeBtn.addEventListener('click', () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cameraArea.style.display = 'none';
      openBtn.style.display = '';
      fileInput.disabled = false;
    });
  }
}