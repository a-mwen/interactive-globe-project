import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber'; // 3D rendering
import { OrbitControls, useTexture, Html } from '@react-three/drei'; // 3D helpers
import * as THREE from 'three'; // three.js for handling 3D objects
import './App.css';

// Globe component
function Globe() {
  const earthTexture = useTexture(require('./assets/earth1.jpg'));
  earthTexture.wrapS = THREE.RepeatWrapping;
  earthTexture.wrapT = THREE.RepeatWrapping;

  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}

// Converts lat/long to 3D position
function latLongToVector3(lat, lon, radius) {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lon - 180) * Math.PI) / 180;

  const x = -(radius * Math.cos(phi) * Math.cos(theta));
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

// Marker component
function Marker({ position, description, info, onClick }) {
  const [hovered, setHovered] = useState(false);
  const scale = hovered ? 1.5 : 1;
  const ref = useRef();

  return (
    <mesh
      position={position}
      ref={ref}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color={hovered ? 'hotpink' : 'orange'} />
      {hovered && (
        <Html position={[0, 0.1, 0]}>
          <div
            style={{
              backgroundColor: 'white',
              padding: '4px',
              borderRadius: '4px',
              color: 'black',
            }}
          >
            <strong>{description}</strong>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function App() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [continentFilter, setContinentFilter] = useState('All');

  const markers = [
    { lat: 40.7128, lon: -74.006, description: 'New York', info: 'The Big Apple!', continent: 'North America' },
    { lat: 48.8566, lon: 2.3522, description: 'Paris', info: 'The City of Lights!', continent: 'Europe' },
    { lat: -33.8688, lon: 151.2093, description: 'Sydney', info: 'Home of the Sydney Opera House!', continent: 'Australia' },
    { lat: 35.6895, lon: 139.6917, description: 'Tokyo', info: 'The bustling capital of Japan!', continent: 'Asia' },
    { lat: 51.5074, lon: -0.1278, description: 'London', info: 'Famous for its history and architecture!', continent: 'Europe' },
    { lat: -23.5505, lon: -46.6333, description: 'São Paulo', info: 'The largest city in Brazil!', continent: 'South America' },
    { lat: 55.7558, lon: 37.6173, description: 'Moscow', info: 'The capital of Russia!', continent: 'Europe' },
    { lat: 28.6139, lon: 77.209, description: 'Delhi', info: 'The heart of India!', continent: 'Asia' },
    { lat: -34.6037, lon: -58.3816, description: 'Buenos Aires', info: 'The Paris of South America!', continent: 'South America' },
    { lat: 41.9028, lon: 12.4964, description: 'Rome', info: 'The Eternal City!', continent: 'Europe' },
  ];

  const handleMarkerClick = (info) => {
    setSelectedMarker(info);
  };

  const filteredMarkers =
    continentFilter === 'All'
      ? markers
      : markers.filter((marker) => marker.continent === continentFilter);

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Interactive Globe Project</h2>
        <p>This project visualizes significant global cities on an interactive 3D globe...</p>
        <label htmlFor="continent">Filter by Continent:</label>
        <select
          id="continent"
          value={continentFilter}
          onChange={(e) => setContinentFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="North America">North America</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="Australia">Australia</option>
          <option value="South America">South America</option>
        </select>
      </div>

      <Canvas className="canvas-container" camera={{ position: [0, 0, 2], fov: 75 }}>
        <ambientLight />
        <directionalLight position={[0, 0, 5]} />
        <OrbitControls />
        <Globe />
        {filteredMarkers.map((marker, index) => {
          const position = latLongToVector3(marker.lat, marker.lon, 1);
          return (
            <Marker
              key={index}
              position={position}
              description={marker.description}
              info={marker.info}
              onClick={() => handleMarkerClick(marker)}
            />
          );
        })}
      </Canvas>

      <div className={`marker-info ${selectedMarker ? 'visible' : ''}`}>
        {selectedMarker ? (
          <>
            <h3>{selectedMarker.description}</h3>
            <p>{selectedMarker.info}</p>
            <button onClick={() => setSelectedMarker(null)}>Close</button>
          </>
        ) : (
          <h3>Select a marker to see details</h3>
        )}
      </div>
    </div>
  );
}

export default App;
