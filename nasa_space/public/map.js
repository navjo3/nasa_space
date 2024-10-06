// Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoibmF2anlvdGgxMjMiLCJhIjoiY20xd3ptZmo2MDFqdTJsczhtNjdkbnN4aiJ9.Uh00dOGn74evoliq-1pdHA';

// Initialize Mapbox Map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [-73.990593, 40.740121], // Initial center
  zoom: 3
});

map.on('load', () => {
  // Define your GeoJSON data source
  const DATA_URL = 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson';

  // Create a Deck.GL overlay
  const deckOverlay = new deck.MapboxOverlay({
    layers: [
      new deck.HeatmapLayer({
        id: 'heatmapLayer',
        data: DATA_URL,
        getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1]],
        getWeight: d => d.properties.mag,
        radiusPixels: 30,
        intensity: 1,
        threshold: 0.03,
        colorRange: [
          [33, 102, 172, 0],
          [103, 169, 207, 128],
          [209, 229, 240, 255],
          [253, 219, 199, 255],
          [239, 138, 98, 255],
          [178, 24, 43, 255]
        ]
      }),
      new deck.ScatterplotLayer({
        id: 'scatterplotLayer',
        data: DATA_URL,
        getPosition: d => [d.geometry.coordinates[0], d.geometry.coordinates[1]],
        getRadius: d => Math.pow(2, d.properties.mag),
        getFillColor: d => {
          const mag = d.properties.mag;
          if (mag <= 2) return [33, 102, 172, 150];
          if (mag <= 3) return [103, 169, 207, 150];
          if (mag <= 4) return [209, 229, 240, 150];
          if (mag <= 5) return [253, 219, 199, 150];
          return [178, 24, 43, 150];
        },
        radiusMinPixels: 1,
        radiusMaxPixels: 50,
        pickable: true,
        onHover: ({ object, x, y }) => {
          const tooltip = document.getElementById('tooltip');
          if (object) {
            tooltip.style.top = `${y}px`;
            tooltip.style.left = `${x}px`;
            tooltip.innerHTML = `Magnitude: ${object.properties.mag}`;
            tooltip.style.display = 'block';
          } else {
            tooltip.style.display = 'none';
          }
        }
      })
    ]
  });

  // Add the Deck.GL overlay to the Mapbox map
  map.addControl(deckOverlay);
});

// Tooltip div for hover events
const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
tooltip.style.position = 'absolute';
tooltip.style.padding = '4px';
tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
tooltip.style.color = 'white';
tooltip.style.display = 'none';
tooltip.style.pointerEvents = 'none';
tooltip.style.fontSize = '12px';
document.body.appendChild(tooltip);

// Add functionality to re-center the map on Chennai or Bangalore
document.getElementById('btn-chennai').addEventListener('click', () => {
  map.flyTo({
    center: [80.2707, 13.0827], // Chennai coordinates
    zoom: 10,
    essential: true // This ensures the animation is not disabled
  });
});

document.getElementById('btn-bangalore').addEventListener('click', () => {
  map.flyTo({
    center: [77.5946, 12.9716], // Bangalore coordinates
    zoom: 10,
    essential: true
  });
});
