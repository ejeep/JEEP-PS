import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: '100%',
  height: '450px',
};

const center = {
  lat: 16.4939,  // Center point for Bayombong, Nueva Vizcaya
  lng: 121.1128,
};

function MapComponent({ onSelectJeep }) {
  const [jeeps, setJeeps] = useState([]);

  // Fetch jeeps' locations from API
  const fetchJeeps = async () => {
    try {
      const response = await axios.get("/api/jeep-location");  // Update with your API endpoint
      setJeeps(response.data);
    } catch (error) {
      console.error("Error fetching jeep locations", error);
    }
  };

  useEffect(() => {
    fetchJeeps();

    // Polling every 10 seconds to update the jeeps' locations
    const interval = setInterval(() => {
      fetchJeeps();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {/* Map over jeeps and display them as markers */}
        {jeeps.map((jeep) => (
          <Marker
            key={jeep.id}
            position={{ lat: jeep.latitude, lng: jeep.longitude }}
            onClick={() => onSelectJeep(jeep)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
