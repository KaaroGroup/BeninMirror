import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TouristSites from './pages/TouristSites';
import Hotels from './pages/Hotels';
import Restaurants from './pages/Restaurants';
import Guides from './pages/Guides';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ServiceDetails from './pages/ServiceDetails';
import PartnerRegistration from './pages/PartnerRegistration';
import PartnerDashboard from './pages/PartnerDashboard';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sites-touristiques" element={<TouristSites />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/service/:service" element={<ServiceDetails />} />
          <Route path="/partner/register" element={<PartnerRegistration />} />
          <Route
            path="/partner/dashboard"
            element={
              <PrivateRoute>
                <PartnerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}