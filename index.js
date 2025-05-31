
const map = L.map('map').setView([40.7128, -74.0060], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'green-icon'
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'red-icon'
  });


  const greyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'red-icon'
  });


  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'red-icon'
  });


function isInNYC(lat, lon) {
  return lat >= 40.4774 && lat <= 40.9176 &&
         lon >= -74.2591 && lon <= -73.7004;
}

function getIconForStatus(status) {
  switch (status) {
    case 'yes': return greenIcon;
    case 'none': return redIcon;
    case 'partial': return blueIcon;
    default: return greyIcon;
  }
}

fetch('http://localhost:3000/nyc_table1')
  .then(response => response.json())
  .then(features => {
    features.forEach(feature => {
      if (isInNYC(feature.lat, feature.lon)) {
        const marker = L.marker([feature.lat, feature.lon], {
          icon: getIconForStatus(feature.has_net)
        }).addTo(map);

        marker.bindPopup(`
          <div>
            <strong>Net Status:</strong><br>
            <select onchange="handleNetStatusChange(${feature.id}, this.value)">
              <option value="yes" ${feature.has_net === 'yes' ? 'selected' : ''}>Yes</option>
              <option value="partial" ${feature.has_net === 'partial' ? 'selected' : ''}>Partial</option>
              <option value="none" ${feature.has_net === 'none' ? 'selected' : ''}>None</option>
              <option value="unknown" ${feature.has_net === 'unknown' ? 'selected' : ''}>Unknown</option>
            </select>
          </div>
        `);
      }
    });
  });


function handleNetStatusChange(id, newStatus) {
  fetch(`http://localhost:3000/nyc_table1/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ has_net: newStatus })
  }).then(response => {
    if (!response.ok) {
      alert('Failed to update net status');
    }
  }).catch(() => alert('Error connecting to server'));
}




map.on('moveend', () => {
  const center = map.getCenter();
  const zoom = map.getZoom();

  localStorage.setItem('mapCenter', JSON.stringify([center.lat, center.lng]));
  localStorage.setItem('mapZoom', zoom);
});


const savedCenter = localStorage.getItem('mapCenter');
const savedZoom = localStorage.getItem('mapZoom');

if (savedCenter && savedZoom) {
  const [lat, lng] = JSON.parse(savedCenter);
  map.setView([lat, lng], Number(savedZoom));
} else {
  map.setView([40.7128, -74.0060], 12); // default view
}


