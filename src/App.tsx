import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ShoppingProvider } from "./context/ShoppingContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { PublicPageGuard } from "./components/PublicPageGuard";
import { RequireAdmin } from "./components/RequireAdmin";

const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Universe = lazy(() => import("./pages/Universe").then((m) => ({ default: m.Universe })));
const ActivityArticles = lazy(() => import("./pages/ActivityArticles").then((m) => ({ default: m.ActivityArticles })));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail").then((m) => ({ default: m.ArticleDetail })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const BrandsPage = lazy(() => import("./pages/BrandsPage").then((m) => ({ default: m.BrandsPage })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Booking = lazy(() => import("./pages/Booking").then((m) => ({ default: m.Booking })));
const Store = lazy(() => import("./pages/Store").then((m) => ({ default: m.Store })));
const Cart = lazy(() => import("./pages/Cart").then((m) => ({ default: m.Cart })));
const CheckoutFlow = lazy(() => import("./pages/CheckoutFlow").then((m) => ({ default: m.CheckoutFlow })));
const Journal = lazy(() => import("./pages/Journal").then((m) => ({ default: m.Journal })));
const JournalPost = lazy(() => import("./pages/JournalPost").then((m) => ({ default: m.JournalPost })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const AuthPage = lazy(() => import("./pages/AuthPage").then((m) => ({ default: m.AuthPage })));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const Dashboard = lazy(() => import("./pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })));
const Reservations = lazy(() => import("./pages/admin/Reservations").then((m) => ({ default: m.Reservations })));
const ContentManager = lazy(() => import("./pages/admin/ContentManager").then((m) => ({ default: m.ContentManager })));
const BoutiqueUnified = lazy(() => import("./pages/admin/BoutiqueUnified").then((m) => ({ default: m.BoutiqueUnified })));
const BoutiqueAnalyticsTab = lazy(() =>
  import("./pages/admin/BoutiqueUnified").then((m) => ({ default: m.BoutiqueAnalyticsTab }))
);
const OrderManager = lazy(() => import("./pages/admin/OrderManager").then((m) => ({ default: m.OrderManager })));
const StoreManager = lazy(() => import("./pages/admin/StoreManager").then((m) => ({ default: m.StoreManager })));
const EditorialCenter = lazy(() => import("./pages/admin/EditorialCenter").then((m) => ({ default: m.EditorialCenter })));
const GlobalServiceManager = lazy(() =>
  import("./pages/admin/GlobalServiceManager").then((m) => ({ default: m.GlobalServiceManager }))
);
const JournalManager = lazy(() => import("./pages/admin/JournalManager").then((m) => ({ default: m.JournalManager })));
const ClientExperienceCenter = lazy(() =>
  import("./pages/admin/ClientExperienceCenter").then((m) => ({ default: m.ClientExperienceCenter }))
);
const SupportManager = lazy(() => import("./pages/admin/SupportManager").then((m) => ({ default: m.SupportManager })));
const TestimonialManager = lazy(() =>
  import("./pages/admin/TestimonialManager").then((m) => ({ default: m.TestimonialManager }))
);
const UserManager = lazy(() => import("./pages/admin/UserManager").then((m) => ({ default: m.UserManager })));
const NewsletterManager = lazy(() => import("./pages/admin/NewsletterManager").then((m) => ({ default: m.NewsletterManager })));
const SettingsView = lazy(() => import("./pages/admin/SettingsView").then((m) => ({ default: m.SettingsView })));
const PointOfInterestCenterPage = lazy(() =>
  import("./pages/admin/PointOfInterestCenterPage").then((m) => ({ default: m.PointOfInterestCenterPage }))
);

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-text-primary/50">
      <div
        className="h-8 w-8 rounded-full border-2 border-brand-gold/30 border-t-brand-gold animate-spin"
        aria-hidden
      />
      <p className="text-[10px] uppercase tracking-[0.35em] font-medium">Chargement</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppProvider>
          <ShoppingProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route element={<PublicPageGuard />}>
                  <Route index element={<Home />} />
                  <Route path="universe/:id" element={<Universe />} />
                  <Route path="activity/:universeId/:activityId/articles" element={<ActivityArticles />} />
                  <Route path="article/:universeId/:activityId/:articleId/detail" element={<ArticleDetail />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="brands" element={<BrandsPage />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="book/:universeId/:activityId/:articleId" element={<Booking />} />
                  <Route path="book/:universeId/:activityId" element={<Booking />} />
                  <Route path="store" element={<Store />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<CheckoutFlow />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="journal/:id" element={<JournalPost />} />
                  <Route path="about" element={<AboutPage />} />
                </Route>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="auth" element={<AuthPage />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="content" element={<ContentManager />} />

                <Route path="boutique" element={<BoutiqueUnified />}>
                  <Route index element={<Navigate to="/admin/boutique/commandes" replace />} />
                  <Route path="commandes" element={<OrderManager />} />
                  <Route path="catalogue" element={<StoreManager />} />
                  <Route path="ventes" element={<BoutiqueAnalyticsTab />} />
                </Route>

                <Route path="experience-client" element={<ClientExperienceCenter />}>
                  <Route index element={<Navigate to="/admin/experience-client/conciergerie" replace />} />
                  <Route path="conciergerie" element={<SupportManager />} />
                  <Route path="temoignages" element={<TestimonialManager />} />
                </Route>

                <Route path="signature" element={<EditorialCenter />}>
                  <Route index element={<Navigate to="/admin/signature/services" replace />} />
                  <Route path="services" element={<GlobalServiceManager />} />
                  <Route path="journal" element={<JournalManager />} />
                </Route>

                <Route path="newsletter" element={<NewsletterManager />} />
                <Route path="points-of-interest" element={<PointOfInterestCenterPage />} />
                <Route path="users" element={<UserManager />} />
                <Route path="settings/about" element={<SettingsView />} />
                <Route path="settings" element={<SettingsView />} />

                <Route path="support" element={<Navigate to="/admin/experience-client/conciergerie" replace />} />
                <Route path="testimonials" element={<Navigate to="/admin/experience-client/temoignages" replace />} />
                <Route path="journal" element={<Navigate to="/admin/signature/journal" replace />} />
                <Route path="globalservices" element={<Navigate to="/admin/signature/services" replace />} />
                <Route path="appearance" element={<Navigate to="/admin/settings" replace />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          </Suspense>
          </ShoppingProvider>
        </AppProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
