import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { AuthProvider, useAuth } from "@/lib/auth";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import CommunityCreate from "./pages/CommunityCreate";
import Challenges from "./pages/Challenges";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Statistics from "./pages/Statistics";
import Wishlist from "./pages/Wishlist";
import MyLists from "./pages/MyLists";
import Settings from "./pages/Settings";
import SearchResults from "./pages/SearchResults";
import CommunityDetail from "./pages/CommunityDetail";
import ChallengeDetail from "./pages/ChallengeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/create" element={<CommunityCreate />} />
              <Route path="/community/:id" element={<CommunityDetail />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenge/:id" element={<ChallengeDetail />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/my-lists" element={<MyLists />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<Faq />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
