// import { useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import mapData from "../assets/countries.json";
import "leaflet/dist/leaflet.css";

const maxBounds = [
  [-90, -180], // Southwest corner
  [90, 180], // Northeast corner
];

const WorldMap = () => {
  return (
    <div>
      <MapContainer
        // style={{ height: "80vh", backgroundColor: "#1e40af" }}
        style={{ height: "80vh" }}
        zoom={2}
        center={[0, 0]}
        maxBounds={maxBounds}
        minZoom={2}
        maxZoom={18}
        maxBoundsViscosity={1.0}
      >
        <GeoJSON data={mapData.features} />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
