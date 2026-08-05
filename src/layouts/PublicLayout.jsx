import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUpRight, FiFacebook, FiInstagram, FiLinkedin, FiMenu, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import Logo from '../components/common/Logo.jsx';
import TechnologyField from '../components/common/TechnologyField.jsx';
import AppLoader from '../components/presentation/AppLoader.jsx';
import { navLinks } from '../config/site.js';
import { publicApi } from '../services/api.js';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const location = useLocation();
  const { services, portfolio, settings } = useSiteContent();

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > previous && current > 120);
      setScrolled(current > 30);
      previous = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!navigating) return undefined;
    const timer = window.setTimeout(() => setNavigating(false), 420);
    return () => window.clearTimeout(timer);
  }, [location.pathname, navigating]);

  const beginNavigation = (href) => {
    setOpen(false);
    if (href !== location.pathname) setNavigating(true);
  };

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [open]);

  const subscribe = async (event) => {
    event.preventDefault();
    try {
      await publicApi.subscribe({ email });
      toast.success('Subscribed successfully.');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Subscription failed.');
    }
  };

  return (
    <div className="app-shell">
      <TechnologyField />
      <header className={`site-header ${hidden ? 'hide' : ''} ${scrolled ? 'scrolled' : ''} ${open ? 'menu-open' : ''}`}>
        <div className="navbar-shell">
          <NavLink to="/" className="brand" onClick={() => beginNavigation('/')}>
            <Logo />
          </NavLink>
          <nav id="primary-navigation" className={open ? 'open' : ''} aria-label="Primary navigation">
            {navLinks.map((item) => (
              <NavLink key={item.href} to={item.href} end={item.href === '/'} onClick={() => beginNavigation(item.href)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <NavLink to="/contact" className="nav-project" onClick={() => beginNavigation('/contact')}>Start a project <FiArrowUpRight /></NavLink>
            <button className="nav-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-navigation" aria-label="Toggle navigation">
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {navigating && <div className="nav-route-loader" role="status" aria-live="polite"><span>NEXTEC</span><i /></div>}

      <main>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={location.pathname}
            className="route-view"
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={mounted ? <AppLoader inline label="Loading next page" /> : null}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>Independent product thinking, striking interfaces, and reliable software systems for teams ready to grow.</p>
            <div className="socials">
              <a href={settings.socials.facebook} aria-label="Facebook" rel="noreferrer">
                <FiFacebook />
              </a>
              <a href={settings.socials.linkedin} aria-label="LinkedIn" rel="noreferrer">
                <FiLinkedin />
              </a>
              <a href={settings.socials.instagram} aria-label="Instagram" rel="noreferrer">
                <FiInstagram />
              </a>
            </div>
          </div>

          <div>
            <h4>Services</h4>
            <ul className="footer-columns">
              {services.slice(0, 8).map((service) => (
                <li key={service.slug || service._id}>{service.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Selected work</h4>
            <ul>
              {portfolio.slice(0, 5).map((item) => (
                <li key={item.slug || item._id}>{item.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Signal notes</h4>
            <p>Occasional field notes on product, systems, and digital growth.</p>
            <form className="newsletter" onSubmit={subscribe}>
              <input type="email" required placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
              <button className="btn primary">Subscribe</button>
            </form>
            <div className="footer-contact">
              <p>{settings.email}</p>
              <p>{settings.phoneUs}</p>
              <p>{settings.phoneUk}</p>
            </div>
          </div>
        </div>

        <div className="copyright">© 2026 {settings.siteName || 'Nextec'}. Crafted with precision.</div>
      </footer>
    </div>
  );
}
