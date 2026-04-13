import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './RoutingMachine';
import './mapSection.scss';

// Fix for default marker icons in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Store coordinates (6 rue Cordeliers, Pau)
const STORE_LOCATION = [43.2951, -0.3708];

// Component to handle map centering and flyTo
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapSection = () => {
  const [mapCenter, setMapCenter] = useState(STORE_LOCATION);
  const [userPos, setUserPos] = useState(null); // tracking user position for routing
  const [zoom, setZoom] = useState(15);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to search address via Nominatim
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newPos);
        setUserPos(newPos); // Set user position for route
        setZoom(14);
      } else {
        setError("Adresse non trouvée.");
      }
    } catch (err) {
      setError("Erreur lors de la recherche.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to geolocate user
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = [position.coords.latitude, position.coords.longitude];
        setMapCenter(newPos);
        setUserPos(newPos); // Set user position for route
        setZoom(14);
      },
      () => {
        alert("Impossible d'accéder à votre position.");
      }
    );
  };

  return (
    <section className="map-section">
      <div className="map-section__container">
        <div className="map-section__header">
          <h2 className="map-section__title">Nous trouver</h2>
          <p className="map-section__subtitle">Passez nous voir au cœur de Pau</p>
        </div>

        <div className="map-section__controls">
          <form onSubmit={handleSearch} className="map-section__search-form">
            <input
              type="text"
              placeholder="Rechercher une adresse..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="map-section__search-input"
            />
            <button type="submit" className="map-section__search-button" disabled={isLoading}>
              {isLoading ? '...' : '🔍'}
            </button>
          </form>
          <button
            onClick={handleLocate}
            className="map-section__locate-button"
            title="Me géolocaliser"
          >
            🎯
          </button>
        </div>

        {error && <div className="map-section__error">{error}</div>}

        <div className="map-section__content">
          {/* Leaflet Map */}
          <div className="map-section__map-wrapper">
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              scrollWheelZoom={false}
              className="map-section__map"
            >
              <ChangeView center={mapCenter} zoom={zoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Routing Logic */}
              {userPos && (
                <RoutingMachine start={userPos} end={STORE_LOCATION} />
              )}

              <Marker position={STORE_LOCATION}>
                <Popup>
                  <strong>SAN-BEÏ</strong> <br />
                  6 rue Cordeliers, Pau
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="map-section__info">
          <div className="map-section__info-item">
            <span className="map-section__info-icon">📍</span>
            <p>6 rue Cordeliers, 64000 Pau</p>
          </div>
          <div className="map-section__info-item">
            <span className="map-section__info-icon">🕙</span>
            <p>Lun - Sam : 9h30 - 19h30</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
