import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { StoreManager } from "./pages/admin/StoreManager";
import { JournalManager } from "./pages/admin/JournalManager";
import { UserManager } from "./pages/admin/UserManager";
import { TestimonialManager } from "./pages/admin/TestimonialManager";
import { NewsletterManager } from "./pages/admin/NewsletterManager";
import { SettingsView } from "./pages/admin/SettingsView";
import { AppearanceManager } from "./pages/admin/AppearanceManager";
import { SupportManager } from "./pages/admin/SupportManager";

import { GlobalServiceManager } from "./pages/admin/GlobalServiceManager";

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
            <Route path="globalservices" element={<GlobalServiceManager />} />
            <Route path="support" element={<SupportManager />} />
            <Route path="store" element={<StoreManager />} />
            <Route path="journal" element={<JournalManager />} />
            <Route path="testimonials" element={<TestimonialManager />} />
            <Route path="newsletter" element={<NewsletterManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="appearance" element={<AppearanceManager />} />
            <Route path="support" element={<SupportManager />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

