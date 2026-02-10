import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ThemeProvider } from "@/lib/ThemeProvider";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import Challenges from "./pages/Challenges";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";
import Wishlist from "./pages/Wishlist";
import MyLists from "./pages/MyLists";
import Settings from "./pages/Settings";
import CommunityDetail from "./pages/CommunityDetail";
import ChallengeDetail from "./pages/ChallengeDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:id" element={<CommunityDetail />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenge/:id" element={<ChallengeDetail />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/my-lists" element={<MyLists />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
