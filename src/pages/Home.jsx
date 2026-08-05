import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import CountUp from 'react-countup';
import { FiArrowRight, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

import SEO from '../utils/seo.js';
import SectionHeader from '../components/common/SectionHeader.jsx';
import ServiceCard from '../components/cards/ServiceCard.jsx';
import PortfolioCard from '../components/cards/PortfolioCard.jsx';
import ContactForm from '../components/forms/ContactForm.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

const landingHero = {
  eyebrow: 'Nextec / Digital Systems',
  title: 'Technology that moves your business forward.',
  subtitle: 'Nextec designs and engineers high-performance digital products for ambitious companies that expect more from their technology partner.',
  primaryCta: { label: 'Start a project', href: '/contact' },
  secondaryCta: { label: 'Explore our work', href: '/portfolio' }
};

export default function Home() {
  const { services, portfolio, testimonials, faqs } = useSiteContent();
  const stats = [
    { value: '80+', label: 'Completed projects' },
    { value: '12+', label: 'Core services' },
    { value: '2', label: 'Global offices' },
    { value: '95+', label: 'Performance target' }
  ];

  return (
    <>
      <SEO title={landingHero.title} description={landingHero.subtitle} />

      <section className="landing-stage">
        <div className="container landing-grid">
          <motion.div className="landing-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <span className="eyebrow">{landingHero.eyebrow}</span>
            <h1>{landingHero.title}</h1>
            <p>{landingHero.subtitle}</p>
            <div className="hero-actions">
              <Link to={landingHero.primaryCta.href} className="btn primary">
                {landingHero.primaryCta.label} <FiArrowRight />
              </Link>
              <Link to={landingHero.secondaryCta.href} className="btn ghost">
                {landingHero.secondaryCta.label}
              </Link>
            </div>
            <div className="hero-features">
              {['MERN engineering', 'Conversion UI', 'Admin powered content'].map((item) => (
                <span key={item}>
                  <FiCheckCircle /> {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="landing-sculpture"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sculpture-axis" aria-hidden="true">
              <i /><i /><i />
            </div>
            <div className="sculpture-mark">N<span>X</span></div>
            <div className="sculpture-readout"><span>PRODUCT SYSTEMS</span><strong>01</strong><b>STRATEGY — DESIGN — ENGINEERING</b></div>
            <div className="sculpture-pulse"><FiTrendingUp /><span>Ready to scale</span></div>
          </motion.div>
        </div>
      </section>

      <section className="signal-stats">
        <div className="container signal-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Services" title="Everything your business needs." text="Strategy, design, development, automation, and growth systems under one roof." />
          <div className="service-grid">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.slug || service._id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section tinted">
        <div className="container">
          <SectionHeader eyebrow="Portfolio" title="Selected work with measurable polish." text="A sharper presentation of brand systems, websites, dashboards, and product experiences." />
          <div className="portfolio-grid compact">
            {portfolio.slice(0, 6).map((item, index) => (
              <PortfolioCard key={item.slug || item._id} item={item} index={index} onPreview={() => {}} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-showcase">
          <SectionHeader eyebrow="Proof" title="Premium delivery without the theatre." text="Clear scope, thoughtful interfaces, stable APIs, and admin-managed content that stays synchronized after launch." />
          <div className="proof-grid">
            {testimonials.slice(0, 3).map((item) => (
              <article className="premium-card proof-card" key={item._id || item.name}>
                <p>{item.quote}</p>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq-stage">
        <div className="container faq-layout">
          <div className="faq-intro">
            <span className="eyebrow">FAQ / 01</span>
            <h2>Clarity before the first commit.</h2>
            <p>Direct answers to the practical questions that shape a better digital product.</p>
            <span className="faq-note">NEXTEC KNOWLEDGE BASE</span>
          </div>
          <div className="faq-list">
            {faqs.slice(0, 5).map((item) => (
              <details key={item._id || item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-grid">
          <div>
            <span className="eyebrow">Let's Build</span>
            <h2>Ready to transform your business?</h2>
            <p>Tell us what you are building. The message lands in MongoDB and reaches the Nextec team through the existing backend flow.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
