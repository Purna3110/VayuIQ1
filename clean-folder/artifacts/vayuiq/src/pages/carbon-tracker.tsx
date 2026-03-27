import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Leaf, Car, Zap, Plane, Bus, Bike, ArrowRight } from "lucide-react";

export default function CarbonTracker() {
  const [transportMode, setTransportMode] = useState("car");
  const [distance, setDistance] = useState("20");
  const [electricity, setElectricity] = useState("150");
  const [score, setScore] = useState<number | null>(null);

  const calculateScore = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy calculation
    let base = Number(distance) * 0.5 + Number(electricity) * 0.8;
    if (transportMode === 'plane') base *= 2;
    if (transportMode === 'bike' || transportMode === 'walk') base = Number(electricity) * 0.8;
    if (transportMode === 'bus') base *= 0.6;
    
    // Simulate API delay
    setTimeout(() => {
      setScore(Math.round(base));
    }, 600);
  };

  const getScoreColor = (val: number) => {
    if (val < 150) return "text-green-400";
    if (val < 300) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
            <Leaf className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Carbon Tracker</h1>
            <p className="text-muted-foreground">Calculate and reduce your daily environmental impact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculateScore} className="space-y-6">
                <div className="space-y-3">
                  <Label>Primary Transport Mode</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'car', icon: Car, label: 'Car' },
                      { id: 'bus', icon: Bus, label: 'Bus' },
                      { id: 'bike', icon: Bike, label: 'Bike' },
                      { id: 'walk', icon: ArrowRight, label: 'Walk' },
                      { id: 'plane', icon: Plane, label: 'Flight' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setTransportMode(mode.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          transportMode === mode.id 
                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                            : 'bg-black/20 border-white/5 hover:border-white/20 text-muted-foreground hover:text-white'
                        }`}
                      >
                        <mode.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Daily Distance Traveled (km)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={distance} 
                      onChange={(e) => setDistance(e.target.value)} 
                      className="pl-10"
                    />
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monthly Electricity Usage (kWh)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={electricity} 
                      onChange={(e) => setElectricity(e.target.value)}
                      className="pl-10" 
                    />
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <Button type="submit" className="w-full">Calculate Footprint</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
            
            {score === null ? (
              <div className="flex flex-col items-center opacity-50">
                <Leaf className="w-20 h-20 mb-4 text-muted-foreground" />
                <p>Enter your details and calculate to see your carbon score.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center z-10 w-full"
              >
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Estimated Carbon Score</h3>
                <div className={`relative flex items-center justify-center w-48 h-48 rounded-full border-4 border-dashed border-white/10 mb-6 ${getScoreColor(score).replace('text-', 'shadow-[0_0_40px_')} text-opacity-30]`}>
                  <div className="absolute inset-0 rounded-full border-t-4 border-current animate-spin opacity-50" style={{ animationDuration: '3s' }} />
                  <div className="flex flex-col items-center">
                    <span className={`text-6xl font-display font-bold text-glow ${getScoreColor(score)}`}>{score}</span>
                    <span className="text-sm font-medium text-muted-foreground mt-1">kg CO2e</span>
                  </div>
                </div>

                <div className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-left">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" /> AI Suggestions
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    {score > 200 && transportMode !== 'bike' && <li>• Switching to public transport could reduce your score by 40%.</li>}
                    <li>• Unplug idle electronics to lower your {electricity} kWh usage.</li>
                    {Number(distance) > 30 && <li>• Consider carpooling for your daily {distance}km commute.</li>}
                  </ul>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

// Simple fallback icon
function MapPinIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
