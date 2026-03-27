import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

interface EarthGlobeProps {
  hotspots?: { lat: number; lng: number; size: number; color: string }[];
  focusCoords?: { lat: number; lng: number } | null;
  onReady?: () => void;
}

export function EarthGlobe({ hotspots = [], focusCoords, onReady }: EarthGlobeProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      // Setup initial view
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.pointOfView({ lat: 20, lng: 78, altitude: 2.5 });
      
      if (onReady) setTimeout(onReady, 500);
    }
  }, [onReady]);

  useEffect(() => {
    if (focusCoords && globeEl.current) {
      // Cinematic zoom
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView(
        { lat: focusCoords.lat, lng: focusCoords.lng, altitude: 0.1 },
        2500 // duration
      );
    }
  }, [focusCoords]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 rounded-full box-glow-primary opacity-30 blur-2xl transform scale-75 pointer-events-none" />
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.2}
        pointsData={hotspots}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude="size"
        pointRadius={0.5}
        pointsMerge={false}
        pointResolution={32}
      />
    </div>
  );
}
