export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const siteConfig = {
  name: 'Nextec',
  domain: 'https://nextec.live',
  email: 'servicesnextec@gmail.com',
  salesEmail: 'sales@nextec.live',
  phoneUs: '+1 551 407 4732',
  phoneUk: '+44 7488 930858',
  officeUs: 'Kearny, NJ, USA',
  officeUk: 'Flat 4 Edinburgh Court, Edinburgh Road, London, England E13 0RH',
  socials: {
    facebook: 'https://facebook.com/nextec',
    linkedin: 'https://linkedin.com/company/nextec',
    instagram: 'https://instagram.com/nextec'
  }
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];
