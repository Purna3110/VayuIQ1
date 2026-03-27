import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateReport, useGetReports } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Target, Send, CheckCircle2, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Report() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Moderate");
  const [isLocating, setIsLocating] = useState(false);

  const { data: reports, isLoading } = useGetReports();
  const createReportMutation = useCreateReport({
    mutation: {
      onSuccess: () => {
        toast({ title: "Report Submitted", description: "Thank you for contributing to VayuIQ." });
        setLocation("");
        setDescription("");
        setSeverity("Moderate");
        queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      },
      onError: () => {
        toast({ title: "Submission Failed", variant: "destructive" });
      }
    }
  });

  const handleLocate = () => {
    setIsLocating(true);
    // Simulate geolocation delay
    setTimeout(() => {
      setLocation("Gachibowli Junction, Hyderabad");
      setIsLocating(false);
      toast({ title: "Location Detected", description: "Gachibowli Junction, Hyderabad" });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReportMutation.mutate({
      data: { location, description, severity, lat: 17.4400, lng: 78.3489 }
    });
  };

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'severe': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-5">
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold mb-2">Report Pollution</h1>
            <p className="text-muted-foreground">Help authorities identify and resolve air quality issues in your area.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location" 
                        className="pl-10"
                        required
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleLocate}
                      disabled={isLocating}
                      className="px-3"
                    >
                      <Target className={`w-4 h-4 ${isLocating ? 'animate-spin text-primary' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-white/10 text-white">
                      <SelectItem value="Low">Low (Dust, minor smoke)</SelectItem>
                      <SelectItem value="Moderate">Moderate (Vehicle exhaust gathering)</SelectItem>
                      <SelectItem value="High">High (Industrial emission, dense smog)</SelectItem>
                      <SelectItem value="Severe">Severe (Open burning, hazardous)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the source and nature of pollution..." 
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createReportMutation.isPending}
                >
                  {createReportMutation.isPending ? "Submitting..." : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Your Recent Reports
          </h2>
          
          <div className="space-y-4">
            {isLoading ? (
              [1,2,3].map(i => (
                <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5" />
              ))
            ) : reports?.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-white/5 border-dashed text-muted-foreground">
                No reports submitted yet.
              </div>
            ) : (
              reports?.map(report => (
                <Card key={report.id} className="bg-white/5 border-white/5 hover:border-white/10 transition-colors">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className={`p-2 rounded-full border ${getSeverityColor(report.severity)} shrink-0`}>
                      <AlertIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold truncate pr-4">{report.location}</h4>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">{report.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border border-white/10 bg-white/5 text-white flex items-center gap-1">
                          {report.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Clock className="w-3 h-3 text-yellow-400" />}
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function AlertIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
