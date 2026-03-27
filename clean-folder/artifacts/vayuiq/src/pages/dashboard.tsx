import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeatMap } from "@/components/map/HeatMap";
import { useGetCurrentAqi, useGetAqiPrediction, useGetHotspots } from "@workspace/api-client-react";
import { getAqiColorClass, getAqiBgClass } from "@/lib/utils";
import { Thermometer, Droplets, Wind, Activity, BrainCircuit } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from "framer-motion";

export default function Dashboard() {
  // Hardcoded Hyderabad coordinates for demo
  const lat = 17.385;
  const lng = 78.486;

  const { data: currentAqi, isLoading: aqiLoading } = useGetCurrentAqi({ lat, lng }, { query: { refetchInterval: 5000 } });
  const { data: prediction, isLoading: predLoading } = useGetAqiPrediction();
  const { data: hotspots, isLoading: spotsLoading } = useGetHotspots();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (aqiLoading || predLoading || spotsLoading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full"
      >
        {/* LEFT COLUMN - REALTIME DATA */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          {/* Main AQI Card */}
          <Card className={`relative overflow-hidden border ${currentAqi ? getAqiColorClass(currentAqi.aqi).replace('text-', 'border-') + '/30' : ''}`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${currentAqi ? getAqiBgClass(currentAqi.aqi) : ''}`} />
            <CardContent className="pt-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Real-time AQI</p>
                  <h2 className="text-2xl font-bold">{currentAqi?.location}</h2>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  LIVE
                </div>
              </div>
              
              <div className="flex items-end gap-3 mb-2">
                <span className={`text-7xl font-display font-bold text-glow ${currentAqi ? getAqiColorClass(currentAqi.aqi) : ''}`}>
                  {currentAqi?.aqi}
                </span>
                <span className="text-lg font-medium text-muted-foreground mb-2">US AQI</span>
              </div>
              
              <p className={`text-xl font-medium mb-6 ${currentAqi ? getAqiColorClass(currentAqi.aqi) : ''}`}>
                {currentAqi?.category}
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <p className="text-sm leading-relaxed text-gray-300">
                  <strong className="text-white block mb-1">Health Recommendation:</strong>
                  {currentAqi?.healthAdvice}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-white/5">
                  <Thermometer className="w-5 h-5 text-red-400 mb-1" />
                  <span className="text-sm font-bold">{currentAqi?.temperature}°C</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Temp</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-white/5">
                  <Droplets className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="text-sm font-bold">{currentAqi?.humidity}%</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Humidity</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-black/40 border border-white/5">
                  <Wind className="w-5 h-5 text-teal-400 mb-1" />
                  <span className="text-sm font-bold">{currentAqi?.windSpeed}m/s</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Wind</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Prediction Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BrainCircuit className="w-5 h-5 text-primary" />
                AI Prediction (Next 3 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="h-[200px] w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prediction?.predictions || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {weekday:'short'})}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelFormatter={(val) => new Date(val).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#000" }}
                      activeDot={{ r: 6, fill: "#60a5fa", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-auto p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary-foreground/90 flex items-start gap-2">
                  <Activity className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  {prediction?.insight}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN - MAP */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
          <Card className="flex-1 p-1 overflow-hidden min-h-[500px] lg:min-h-0 relative">
            <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-xl glass-panel-darker pointer-events-none">
              <h3 className="font-display font-bold text-lg mb-1">Pollution Heatmap</h3>
              <div className="flex gap-2 text-xs font-medium">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Good</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Mod</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High</span>
              </div>
            </div>
            <HeatMap hotspots={hotspots || []} center={[lat, lng]} />
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
