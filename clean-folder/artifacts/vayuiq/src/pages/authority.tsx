import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeatMap } from "@/components/map/HeatMap";
import { useGetTasks, useCreateTask, useUpdateTask, useGetHotspots } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare, ListTodo, MapPin, Plus, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AuthorityDashboard() {
  const { data: tasks, isLoading: tasksLoading } = useGetTasks();
  const { data: hotspots } = useGetHotspots();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");

  const createTaskMutation = useCreateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
        setNewTaskOpen(false);
        setTitle(""); setLocation(""); setDesc("");
        toast({ title: "Task created successfully" });
      }
    }
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate({ data: { title, location, description: desc } });
  };

  return (
    <Layout fullScreen={false}>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Authority Command Center</h1>
          <p className="text-muted-foreground mt-1">Manage field operations and monitor severe pollution zones.</p>
        </div>
        
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Dispatch Team</Button>
          </DialogTrigger>
          <DialogContent className="glass-panel-darker border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Dispatch Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="e.g. Inspect factory emissions" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={e=>setLocation(e.target.value)} required placeholder="e.g. Industrial Zone A" />
              </div>
              <div className="space-y-2">
                <Label>Instructions / Details</Label>
                <Textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Provide specifics..." />
              </div>
              <Button type="submit" className="w-full" disabled={createTaskMutation.isPending}>
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
        
        {/* Task List */}
        <Card className="flex flex-col h-full overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4 bg-white/5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListTodo className="w-5 h-5 text-primary" /> Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {tasksLoading ? (
              <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </CardContent>
        </Card>

        {/* Live Heatmap */}
        <Card className="flex flex-col h-full overflow-hidden p-1">
          <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-xl glass-panel-darker pointer-events-none">
            <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" /> Hotspot Radar
            </h3>
          </div>
          <HeatMap hotspots={hotspots || []} />
        </Card>

      </div>
    </Layout>
  );
}

function TaskCard({ task }: { task: any }) {
  const [status, setStatus] = useState(task.status);
  const [notes, setNotes] = useState(task.notes || "");
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateMutation = useUpdateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
        setIsEditing(false);
        toast({ title: "Task updated" });
      }
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ id: task.id, data: { status, notes } });
  };

  const statusColors: Record<string, string> = {
    'Pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'In Progress': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'Completed': 'text-green-400 bg-green-400/10 border-green-400/20'
  };

  return (
    <div className={`p-4 rounded-xl border transition-all ${status === 'Completed' ? 'bg-white/5 border-white/5 opacity-70' : 'bg-black/40 border-white/10 hover:border-white/20'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-bold text-lg ${status === 'Completed' ? 'line-through text-gray-400' : 'text-white'}`}>{task.title}</h4>
        <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${statusColors[status] || statusColors['Pending']}`}>
          {status}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {task.location}
      </p>
      
      <p className="text-sm text-gray-300 mb-4">{task.description}</p>

      {isEditing ? (
        <div className="space-y-3 pt-3 border-t border-white/10 mt-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 text-xs bg-black/40 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-white/10 text-white">
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Add field notes..."
            className="h-16 text-xs resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-3">
          <div className="text-xs text-gray-500 max-w-[70%] truncate">
            {task.notes ? <span className="italic">Notes: {task.notes}</span> : "No notes"}
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => setIsEditing(true)}>
            Update Status
          </Button>
        </div>
      )}
    </div>
  );
}
