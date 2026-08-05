import { useEffect, useMemo, useState } from 'react';
import { publicApi } from '../services/api.js';
import {
  ebookBenefits,
  faqs as fallbackFaqs,
  portfolio as fallbackPortfolio,
  services as fallbackServices,
  stats as fallbackStats,
  testimonials as fallbackTestimonials
} from '../utils/content.js';
import { siteConfig } from '../config/site.js';

const fallbackHero = {
  eyebrow: 'Smart Digital Solutions',
  title: 'Build Premium Digital Products That Scale.',
  subtitle:
    'Nextec partners with ambitious startups and enterprises to design, engineer, and grow exceptional digital products that convert visitors into customers.',
  primaryCta: { label: 'Start Project', href: '/contact' },
  secondaryCta: { label: 'View Portfolio', href: '/portfolio' },
  stats: fallbackStats.map(([value, label]) => ({ value, label }))
};

const fallbackEbook = {
  title: 'Agency Hiring Blueprint',
  subtitle:
    'Unlock the exact hiring system used by top digital agencies to build skilled, affordable teams, even on a tight budget.',
  price: 14.99,
  benefits: ebookBenefits,
  checkoutUrl: 'https://www.paypal.com/'
};

const fallbackPackages = [
  {
    title: 'Launch Studio',
    slug: 'launch-studio',
    eyebrow: 'Starter',
    badge: 'Fast Launch',
    description: 'A premium website foundation for brands that need a refined presence, strong conversion flow, and admin-editable content.',
    price: 1499,
    currency: '$',
    cadence: 'project',
    features: ['Premium responsive website', 'MongoDB-powered content', 'Contact and lead flow', 'SEO-ready structure'],
    deliverables: ['Discovery sprint', 'Creative UI direction', 'Frontend build', 'Backend integration'],
    ctaLabel: 'Start Launch',
    ctaHref: '/contact',
    order: 1
  },
  {
    title: 'Growth System',
    slug: 'growth-system',
    eyebrow: 'Most Popular',
    badge: 'Recommended',
    description: 'A full business website with conversion sections, portfolio depth, analytics-ready architecture, and polished admin workflows.',
    price: 3499,
    currency: '$',
    cadence: 'project',
    featured: true,
    features: ['Premium multi-page experience', 'Portfolio and service CMS', 'Admin dashboard polish', 'Performance optimization'],
    deliverables: ['UX strategy', 'Visual system', 'MERN implementation', 'Launch support'],
    ctaLabel: 'Choose Growth',
    ctaHref: '/contact',
    order: 2
  },
  {
    title: 'Enterprise Build',
    slug: 'enterprise-build',
    eyebrow: 'Scale',
    badge: 'Custom',
    description: 'A deeper product-grade engagement for SaaS dashboards, custom portals, automation, and multi-step business workflows.',
    price: 7999,
    currency: '$',
    cadence: 'starting',
    features: ['Custom MERN product modules', 'Role-aware admin systems', 'API architecture', 'Premium launch QA'],
    deliverables: ['Technical planning', 'Dashboard/product UI', 'CRUD modules', 'Deployment guidance'],
    ctaLabel: 'Discuss Enterprise',
    ctaHref: '/contact',
    order: 3
  }
];

export function useSiteContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = () => publicApi
      .bootstrap()
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch(() => {
        if (active) setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    load();
    const refresh = () => {
      if (!document.hidden) load();
    };
    window.addEventListener('focus', refresh);
    window.addEventListener('nextec:content-updated', refresh);

    return () => {
      active = false;
      window.removeEventListener('focus', refresh);
      window.removeEventListener('nextec:content-updated', refresh);
    };
  }, []);

  return useMemo(() => {
    const settings = mergeSettings(data?.settings);
    const services = data?.services?.length ? data.services : fallbackServices;
    const portfolio = data?.portfolio?.length ? data.portfolio : fallbackPortfolio;
    const testimonials = data?.testimonials?.length ? data.testimonials : fallbackTestimonials;
    const faqs = normalizeFaqs(data?.faqs?.length ? data.faqs : fallbackFaqs);
    const hero = data?.hero || fallbackHero;
    const ebook = data?.ebook || fallbackEbook;
    const packages = Array.isArray(data?.packages) ? data.packages : fallbackPackages;

    return {
      loading,
      hero,
      services,
      portfolio,
      team: data?.team || [],
      testimonials,
      faqs,
      ebook,
      packages,
      settings
    };
  }, [data, loading]);
}

function mergeSettings(settings = {}) {
  return {
    ...siteConfig,
    ...settings,
    socials: { ...siteConfig.socials, ...(settings.socials || {}) },
    salesEmail: settings.email || siteConfig.salesEmail,
    email: settings.email || siteConfig.email
  };
}

function normalizeFaqs(items) {
  return items.map((item) => {
    if (Array.isArray(item)) return { question: item[0], answer: item[1], category: 'General' };
    return item;
  });
}
