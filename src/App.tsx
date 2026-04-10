import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Components
import Index from "./components/LandingPage/Index";
import AIChatBot from "./components/LandingPage/AIChatBot";
import AboutUs from "./components/LandingPage/aboutUs"; // Added AboutUs
import Navbar from "./components/LandingPage/Navbar";   // Added Navbar for consistent sub-page UI
import NotFound from "./pages/NotFound";

// 1. Initialize QueryClient outside the component to prevent re-creations on render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// 2. ScrollToTop Component (Must be a child of BrowserRouter)
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait slightly to ensure DOM has updated and previous styles (like overflow) have cleared
    requestAnimationFrame(() => {
      // Force scroll reset
      window.scrollTo({ top: 0, behavior: "instant" });
      document.body.scrollTop = 0; // Safari
      document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
    });
    
    // Refresh GSAP to prevent "ghost" scroll heights from previous routes
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      // Small delay ensures DOM has updated before GSAP recalculates
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <BrowserRouter>
          {/* Handles scroll reset and animation cleanup on every navigation */}
          <ScrollToTop />
          
          <Routes>
            {/* Main Landing Page (Navbar is handled internally in Index.tsx) */}
            <Route path="/" element={<Index />} />
            
            {/* About Us Route: Includes Navbar with showLogo=true */}
            <Route path="/about" element={
              <>
                <Navbar showLogo={true} />
                <AboutUs />
              </>
            } />

            {/* AI Assistant Route: Includes Navbar with showLogo=true */}
            <Route path="/ai-assistant" element={
              <>
                <Navbar showLogo={true} />
                <AIChatBot />
              </>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* UI Notifications placed globally so they persist across routes */}
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;