import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { EarthGlobe } from "@/components/globe/EarthGlobe";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Wind } from "lucide-react";
import { useGetCurrentAqi } from "@workspace/api-client-react";
import { getAqiColorClass, getAqiGlowClass } from "@/lib/utils";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [isZooming, setIsZooming] = useState(false);
  const [focusCoords, setFocusCoords] = useState<{lat: number, lng: number} | null>(null);

  // Mock initial generic data before user allows location
  const mockAqi = {
    aqi: 142,
    category: "Unhealthy for Sensitive Groups",
    dominantPollutant: "PM2.5",
    riskPercentage: 68
  };

  const handleAllowLocation = () => {
    setIsZooming(true);
    // Target Hyderabad coordinates
    setFocusCoords({ lat: 17.3850, lng: 78.4867 });
    
    // After cinematic zoom duration (2.5s), navigate to dashboard
    setTimeout(() => {
      setLocation("/dashboard");
    }, 2800);
  };

  return (
    <Layout fullScreen>
      <div className="flex-1 w-full h-full flex flex-col lg:flex-row relative pt-20">
        
        {/* LEFT PANEL */}
        <motion.div 
          className="w-full lg:w-[40%] xl:w-[35%] h-full flex flex-col justify-center px-8 lg:pl-16 lg:pr-8 z-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isZooming ? 0 : 1, x: isZooming ? -50 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-white/80 tracking-widest uppercase">Global Average View</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-white mb-2 leading-tight">
            Air Quality<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Index</span>
          </h1>
          
          <p className="text-muted-foreground mb-8 text-lg">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* Huge AQI Display Card */}
          <div className={`relative p-8 rounded-[2rem] bg-black/40 backdrop-blur-xl border ${getAqiGlowClass(mockAqi.aqi)} mb-8 overflow-hidden group transition-all duration-500`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col">
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">Current AQI</span>
              <div className="flex items-baseline gap-4">
                <span className={`text-8xl font-display font-bold tracking-tighter ${getAqiColorClass(mockAqi.aqi)} text-glow`}>
                  {mockAqi.aqi}
                </span>
                <span className="text-xl font-medium text-white/70">US AQI</span>
              </div>
              <p className={`mt-4 text-xl font-medium ${getAqiColorClass(mockAqi.aqi)}`}>
                {mockAqi.category}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-xs uppercase tracking-wider font-semibold">Health Risk</span>
              </div>
              <span className="text-3xl font-display font-bold text-white">{mockAqi.riskPercentage}%</span>
            </div>
            
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wind className="w-4 h-4 text-blue-400" />
                <span className="text-xs uppercase tracking-wider font-semibold">Dominant</span>
              </div>
              <span className="text-3xl font-display font-bold text-white">{mockAqi.dominantPollutant}</span>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full text-lg h-16 rounded-2xl group relative overflow-hidden"
            onClick={handleAllowLocation}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <MapPin className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
            Allow Location to Zoom In
          </Button>
        </motion.div>

        {/* RIGHT PANEL - GLOBE */}
        <div className="absolute inset-0 lg:static lg:flex-1 h-full z-10 pointer-events-none lg:pointer-events-auto">
          {/* Fading gradient overlay for mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent lg:hidden z-10" />
          
          <EarthGlobe 
            focusCoords={focusCoords}
            hotspots={[
              { lat: 17.3850, lng: 78.4867, size: 0.1, color: '#ef4444' }, // Hyderabad
              { lat: 28.6139, lng: 77.2090, size: 0.15, color: '#a855f7' }, // Delhi
              { lat: 19.0760, lng: 72.8777, size: 0.12, color: '#f97316' }, // Mumbai
              { lat: 40.7128, lng: -74.0060, size: 0.08, color: '#eab308' }, // NY
              { lat: 39.9042, lng: 116.4074, size: 0.2, color: '#a855f7' }, // Beijing
            ]}
          />
        </div>

        {/* Cinematic Zoom Overlay */}
        <motion.div
          className="absolute inset-0 bg-black z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isZooming ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        />
      </div>
    </Layout>
  );
}
