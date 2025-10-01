import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CookieConsent } from "./components/CookieConsent";
import { RoleGuard } from "./components/RoleGuard";
import { RoleBasedRoute } from "./components/RoleBasedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import B2BLanding from "./pages/B2BLanding";
import B2BPortal from "./pages/B2BPortal";
import AcceptInvitation from "./pages/AcceptInvitation";
import Organizations from "./pages/Organizations";
import JournalNew from "./pages/JournalNew";
import Meditation from "./pages/Meditation";
import Community from "./pages/Community";
import Therapy from "./pages/Therapy";
import AIChat from "./pages/AIChat";
import Settings from "./pages/Settings";
import Coach from "./pages/Coach";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Nyvee from "./pages/Nyvee";
import EmotionalScan from "./pages/EmotionalScan";
import HumeEmotionalScan from "./pages/HumeEmotionalScan";
import MusicTherapy from "./pages/MusicTherapy";
import MusicLibrary from "./pages/MusicLibrary";
import VRBreath from "./pages/VRBreath";
import VRGalaxy from "./pages/VRGalaxy";
import FlashGlow from "./pages/FlashGlow";
import Breathwork from "./pages/Breathwork";
import ARFilters from "./pages/ARFilters";
import BubbleBeat from "./pages/BubbleBeat";
import BossGrit from "./pages/BossGrit";
import MoodMixer from "./pages/MoodMixer";
import Leaderboard from "./pages/Leaderboard";
import StorySynth from "./pages/StorySynth";
import Activity from "./pages/Activity";
import WeeklyBars from "./pages/WeeklyBars";
import AmbitionArcade from "./pages/AmbitionArcade";
import RHDashboard from "./pages/RHDashboard";
import ScreenSilk from "./pages/ScreenSilk";
import Onboarding from "./pages/Onboarding";
import Help from "./pages/Help";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CookieConsent />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/b2b" element={<B2BLanding />} />
            <Route path="/b2b/portal" element={<ProtectedRoute><B2BPortal /></ProtectedRoute>} />
            <Route path="/app/accept-invitation" element={<AcceptInvitation />} />
            <Route path="/organizations" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <Organizations />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/app/organizations" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <Organizations />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/app/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/app/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/app/rh-dashboard" element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['manager_b2b', 'admin']}>
                  <RHDashboard />
                </RoleBasedRoute>
              </ProtectedRoute>
            } />
            <Route path="/journal" element={<ProtectedRoute><JournalNew /></ProtectedRoute>} />
            <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/therapy" element={<ProtectedRoute><Therapy /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/coach" element={<ProtectedRoute><Coach /></ProtectedRoute>} />
            
            {/* Nouveaux modules EmotionsCare */}
            <Route path="/nyvee" element={<ProtectedRoute><Nyvee /></ProtectedRoute>} />
            <Route path="/emotional-scan" element={<ProtectedRoute><EmotionalScan /></ProtectedRoute>} />
            <Route path="/hume-scan" element={<ProtectedRoute><HumeEmotionalScan /></ProtectedRoute>} />
            <Route path="/music" element={<ProtectedRoute><MusicTherapy /></ProtectedRoute>} />
            <Route path="/music-library" element={<ProtectedRoute><MusicLibrary /></ProtectedRoute>} />
            <Route path="/vr-breath" element={<ProtectedRoute><VRBreath /></ProtectedRoute>} />
            <Route path="/vr-galaxy" element={<ProtectedRoute><VRGalaxy /></ProtectedRoute>} />
            <Route path="/flash-glow" element={<ProtectedRoute><FlashGlow /></ProtectedRoute>} />
            <Route path="/breath" element={<ProtectedRoute><Breathwork /></ProtectedRoute>} />
            <Route path="/face-ar" element={<ProtectedRoute><ARFilters /></ProtectedRoute>} />
            <Route path="/bubble-beat" element={<ProtectedRoute><BubbleBeat /></ProtectedRoute>} />
            <Route path="/boss-grit" element={<ProtectedRoute><BossGrit /></ProtectedRoute>} />
            <Route path="/mood-mixer" element={<ProtectedRoute><MoodMixer /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/story-synth" element={<ProtectedRoute><StorySynth /></ProtectedRoute>} />
            <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
            <Route path="/weekly-bars" element={<ProtectedRoute><WeeklyBars /></ProtectedRoute>} />
            <Route path="/ambition-arcade" element={<ProtectedRoute><AmbitionArcade /></ProtectedRoute>} />
          <Route path="/app/rh" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['manager_b2b', 'admin']}>
                <RHDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
            <Route path="/app/screen-silk" element={<ProtectedRoute><ScreenSilk /></ProtectedRoute>} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
