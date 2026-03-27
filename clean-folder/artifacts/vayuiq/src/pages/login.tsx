import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Wind, ShieldCheck, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [tab, setTab] = useState<"citizen" | "authority">("citizen");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        if (data.success && data.user) {
          login(data.user);
          toast({ title: "Login Successful", description: `Welcome back, ${data.user.name}` });
          setLocation(data.user.role === "authority" ? "/authority" : "/hero");
        } else {
          toast({ title: "Login Failed", description: "Invalid credentials", variant: "destructive" });
        }
      },
      onError: (error) => {
        toast({ title: "Error", description: error.error || "Authentication failed", variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { username, password, role: tab } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated abstract background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-primary/5 blur-[120px]" 
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-accent/5 blur-[120px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/25 mb-6 relative">
            <div className="absolute inset-0 rounded-2xl border border-white/20" />
            <Wind className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-2">VayuIQ</h1>
          <p className="text-muted-foreground text-center">AI-Powered Air Quality Intelligence</p>
        </div>

        <Card className="glass-panel-darker border-white/10">
          <CardHeader className="pb-4">
            <div className="flex p-1 bg-black/40 rounded-xl mb-4 border border-white/5">
              <button
                onClick={() => setTab("citizen")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                  tab === "citizen" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white/80"
                }`}
              >
                <User className="w-4 h-4" /> Citizen
              </button>
              <button
                onClick={() => setTab("authority")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                  tab === "authority" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white/80"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Authority
              </button>
            </div>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              {tab === "authority" ? "Login with authorized credentials (e.g. Ravi/1234)" : "Enter your details to access the platform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={tab === "authority" ? "Enter authority ID" : "Enter email"} 
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base mt-2" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
