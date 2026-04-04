import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Universe } from "./pages/Universe";
import { ServicesPage } from "./pages/ServicesPage";
import { BrandsPage } from "./pages/BrandsPage";
import { Contact } from "./pages/Contact";
import { Booking } from "./pages/Booking";
import { Store } from "./pages/Store";
import { Cart } from "./pages/Cart";
import { Journal } from "./pages/Journal";
import { JournalPost } from "./pages/JournalPost";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Reservations } from "./pages/admin/Reservations";
import { ContentManager } from "./pages/admin/ContentManager";
import { BoutiqueUnified } from "./pages/admin/BoutiqueUnified";
import { EditorialCenter } from "./pages/admin/EditorialCenter";
import { ClientExperienceCenter } from "./pages/admin/ClientExperienceCenter";
import { UserManager } from "./pages/admin/UserManager";
import { NewsletterManager } from "./pages/admin/NewsletterManager";
import { SettingsView } from "./pages/admin/SettingsView";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Client Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="universe/:id" element={<Universe />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="contact" element={<Contact />} />
            <Route path="book/:universeId/:activityId" element={<Booking />} />
            <Route path="store" element={<Store />} />
            <Route path="cart" element={<Cart />} />
            <Route path="journal" element={<Journal />} />
            <Route path="journal/:id" element={<JournalPost />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="auth" element={<AuthPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="boutique" element={<BoutiqueUnified />} />
            <Route path="experience-client" element={<ClientExperienceCenter />} />
            <Route path="signature" element={<EditorialCenter />} />
            <Route path="newsletter" element={<NewsletterManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="settings" element={<SettingsView />} />
            
            {/* Automatic Redirects for Legacy Routes */}
            <Route path="support" element={<Navigate to="/admin/experience-client" replace />} />
            <Route path="testimonials" element={<Navigate to="/admin/experience-client" replace />} />
            <Route path="journal" element={<Navigate to="/admin/signature" replace />} />
            <Route path="globalservices" element={<Navigate to="/admin/signature" replace />} />
            <Route path="appearance" element={<Navigate to="/admin/settings" replace />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

