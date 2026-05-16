import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function TripMap({ journeys }) {
  const [showAllTrips, setShowAllTrips] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Compute center from all coordinates
  const allLats = journeys.flatMap(j => [j.startLat, j.endLat]);
  const allLngs = journeys.flatMap(j => [j.startLng, j.endLng]);
  const center = [
    allLats.reduce((a, b) => a + b, 0) / allLats.length,
    allLngs.reduce((a, b) => a + b, 0) / allLngs.length,
  ];

  // Show at most 50 recent trips by default
  const displayJourneys = journeys
    .sort((a, b) => b.startDate - a.startDate)
    .slice(0, showAllTrips ? undefined : 50);

  return (
    <div className="map-container">
      <div className="map-controls">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showAllTrips}
            onChange={(e) => setShowAllTrips(e.target.checked)}
          />
          Show all {journeys.length} trips (currently showing {displayJourneys.length})
        </label>
      </div>
      <MapContainer
        center={center}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        className="trip-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {displayJourneys.map((trip) => (
          <Polyline
            key={trip.id}
            positions={[
              [trip.startLat, trip.startLng],
              [trip.endLat, trip.endLng],
            ]}
            pathOptions={{
              color: getTripColor(trip),
              weight: 2,
              opacity: 0.6,
            }}
            eventHandlers={{
              click: () => setSelectedTrip(trip),
            }}
          >
            <Tooltip direction="top" opacity={0.9}>
              {trip.distance.toFixed(1)} mi — {trip.category}
            </Tooltip>
          </Polyline>
        ))}
        {displayJourneys.map((trip) => (
          <Marker
            key={`start-${trip.id}`}
            position={[trip.startLat, trip.startLng]}
            eventHandlers={{
              click: () => setSelectedTrip(trip),
            }}
          >
            <Popup>
              <div className="popup-content">
                <strong>{trip.category}</strong>
                <div>{trip.startAddress}</div>
                <div>{trip.startDate.toLocaleString()}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {selectedTrip && (
        <div className="trip-detail-panel" onClick={() => setSelectedTrip(null)}>
          <div className="trip-detail-content" onClick={(e) => e.stopPropagation()}>
            <h4>{selectedTrip.category}</h4>
            <p>{selectedTrip.startDate.toLocaleString()}</p>
            <p>{selectedTrip.startAddress} → {selectedTrip.endAddress}</p>
            <p>{selectedTrip.distance.toFixed(1)} mi in {Math.round(selectedTrip.duration)} min</p>
            <p>{selectedTrip.efficiency.toFixed(0)} Wh/mi</p>
            <p>SOC: {selectedTrip.socStart}% → {selectedTrip.socEnd}%</p>
            <button onClick={() => setSelectedTrip(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function getTripColor(trip) {
  switch (trip.category.toLowerCase()) {
    case 'commute': return '#3b82f6';
    case 'leisure': return '#10b981';
    case 'shopping': return '#f59e0b';
    case 'errands': return '#8b5cf6';
    default: return '#ef4444';
  }
}

export default TripMap;
