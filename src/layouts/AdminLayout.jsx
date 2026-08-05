import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiBriefcase, FiCreditCard, FiHelpCircle, FiHome, FiImage, FiLogOut, FiMail, FiMessageSquare, FiSettings, FiStar, FiUsers } from 'react-icons/fi';
import Logo from '../components/common/Logo.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import AppLoader from '../components/presentation/AppLoader.jsx';

const adminLinks = [
  ['Dashboard', '/nxt-admin', FiActivity],
  ['Hero', '/nxt-admin/heroes', FiHome],
  ['Services', '/nxt-admin/services', FiBriefcase],
  ['Packages', '/nxt-admin/packages', FiCreditCard],
  ['Portfolio', '/nxt-admin/portfolio', FiImage],
  ['Team', '/nxt-admin/team', FiUsers],
  ['Testimonials', '/nxt-admin/testimonials', FiStar],
  ['FAQ', '/nxt-admin/faqs', FiHelpCircle],
  ['Ebook', '/nxt-admin/ebooks', FiBriefcase],
  ['Contacts', '/nxt-admin/messages', FiMessageSquare],
  ['Subscribers', '/nxt-admin/subscribers', FiMail],
  ['Media', '/nxt-admin/media', FiImage],
  ['Settings', '/nxt-admin/settings', FiSettings]
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const signOut = async () => { await logout(); navigate('/nxt-admin-login'); };
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="admin-shell">
      <aside>
        <div className="admin-brand"><Logo /><span>CONTROL ROOM</span></div>
        <nav>{adminLinks.map(([label, path, Icon]) => <NavLink end={path === '/nxt-admin'} to={path} key={path}><Icon />{label}</NavLink>)}</nav>
        <button className="btn ghost" onClick={signOut}><FiLogOut /> End session</button>
      </aside>
      <main>
        <motion.div key={location.pathname} className="admin-route-view" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}>
          <Suspense fallback={mounted ? <AppLoader inline label="Loading workspace" /> : null}>
            <Outlet />
          </Suspense>
        </motion.div>
      </main>
    </div>
  );
}
