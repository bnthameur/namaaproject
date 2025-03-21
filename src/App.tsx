
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from "./pages/Dashboard";
import Finance from "./pages/Finance";
import Students from "./pages/Students";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/students" element={<Students />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
