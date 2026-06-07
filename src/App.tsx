import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import HomePage from '@/pages/HomePage';
import MarketplacePage from '@/pages/MarketplacePage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import OrdersPage from '@/pages/OrdersPage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/static/AboutPage';
import HelpPage from '@/pages/static/HelpPage';
import SafetyPage from '@/pages/static/SafetyPage';
import ContactPage from '@/pages/static/ContactPage';
import ReportPage from '@/pages/static/ReportPage';
import BlogPage from '@/pages/static/BlogPage';
import AffiliatePage from '@/pages/static/AffiliatePage';

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: (scopes: string[], onIncompletePaymentFound: (payment: unknown) => void) => Promise<{ user: { uid: string; username: string } }>;
    };
  }
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          {/* Static pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/affiliate" element={<AffiliatePage />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}
