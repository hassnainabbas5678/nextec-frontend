import { useEffect } from 'react';
import { siteConfig } from '../config/site.js';

export default function SEO({ title, description, path = '/', image, schema }) {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | Smart Business Solutions`;
  const url = `${siteConfig.domain}${path}`;
  const desc = description || 'Nextec builds premium websites, marketing systems, software, SEO, content, and smart business solutions for ambitious teams.';

  useEffect(() => {
    document.title = fullTitle;
    const tags = [
      ['name', 'description', desc],
      ['property', 'og:title', fullTitle],
      ['property', 'og:description', desc],
      ['property', 'og:url', url],
      ['property', 'og:type', 'website'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', fullTitle],
      ['name', 'twitter:description', desc]
    ];
    if (image) tags.push(['property', 'og:image', image]);
    tags.forEach(([attr, key, value]) => {
      let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    });
    if (!image) document.head.querySelector('meta[property="og:image"]')?.remove();
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    let jsonLd = document.head.querySelector('#nextec-structured-data');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.id = 'nextec-structured-data';
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(schema || {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: siteConfig.name,
          url: siteConfig.domain,
          email: siteConfig.email,
          areaServed: ['United States', 'United Kingdom', 'Global'],
          address: { '@type': 'PostalAddress', addressLocality: 'Kearny', addressRegion: 'NJ', addressCountry: 'US' }
        });
  }, [fullTitle, desc, url, image, schema]);

  return null;
}
