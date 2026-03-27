import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";

import Login from "@/pages/login";
import Hero from "@/pages/hero";
import Dashboard from "@/pages/dashboard";
import CarbonTracker from "@/pages/carbon-tracker";
import Report from "@/pages/report";
import AuthorityDashboard from "@/pages/authority";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, allowedRole }: { component: React.ComponentType; allowedRole?: string }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Redirect to={user?.role === "authority" ? "/authority" : "/hero"} />;
  }

  return <Component />;
}

function RootRoute() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Redirect to={user?.role === "authority" ? "/authority" : "/hero"} />;
  }
  return <Login />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRoute} />
      <Route path="/hero"><ProtectedRoute component={Hero} allowedRole="citizen" /></Route>
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} allowedRole="citizen" /></Route>
      <Route path="/carbon-tracker"><ProtectedRoute component={CarbonTracker} allowedRole="citizen" /></Route>
      <Route path="/report"><ProtectedRoute component={Report} allowedRole="citizen" /></Route>
      <Route path="/authority"><ProtectedRoute component={AuthorityDashboard} allowedRole="authority" /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
