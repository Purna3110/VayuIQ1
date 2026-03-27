import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hotspot } from '@workspace/api-client-react';

// Fix for leaflet icon issue in Vite, though we are using CircleMarkers mostly
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapFocus({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 2 });
  }, [center, map]);
  return null;
}

interface HeatMapProps {
  hotspots: Hotspot[];
  center?: [number, number];
}

export function HeatMap({ hotspots, center = [17.385, 78.486] }: HeatMapProps) {
  
  const getColor = (aqi: number) => {
    if (aqi <= 50) return '#22c55e'; // Green
    if (aqi <= 100) return '#eab308'; // Yellow
    if (aqi <= 150) return '#f97316'; // Orange
    if (aqi <= 200) return '#ef4444'; // Red
    return '#a855f7'; // Purple
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden glass-panel border border-white/10 z-0">
      <MapContainer 
        center={center} 
        zoom={12} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapFocus center={center} />
        
        {/* Simulate road network glow by rendering larger blurred circles under smaller sharp ones */}
        {hotspots.map((spot) => (
          <React.Fragment key={spot.id}>
            {/* Outer Glow */}
            <CircleMarker
              center={[spot.lat, spot.lng]}
              pathOptions={{
                color: getColor(spot.aqi),
                fillColor: getColor(spot.aqi),
                fillOpacity: 0.15,
                weight: 0,
              }}
              radius={spot.aqi > 150 ? 40 : 25}
            />
            {/* Inner Core */}
            <CircleMarker
              center={[spot.lat, spot.lng]}
              pathOptions={{
                color: getColor(spot.aqi),
                fillColor: getColor(spot.aqi),
                fillOpacity: 0.8,
                weight: 2,
                opacity: 1
              }}
              radius={spot.aqi > 150 ? 8 : 5}
            >
              <Popup className="dark-popup">
                <div className="font-sans">
                  <h4 className="font-bold text-lg mb-1">{spot.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">AQI</span>
                    <span className="font-display font-bold text-xl" style={{ color: getColor(spot.aqi) }}>
                      {spot.aqi}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-md text-xs font-semibold bg-white/10">
                    {spot.severity}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        ))}
      </MapContainer>
      
      {/* Overlay gradient to blend map edges into the dark theme */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_20px_rgba(5,10,20,0.8)]" />
    </div>
  );
}
