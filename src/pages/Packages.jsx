import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiLayers, FiShield, FiZap } from 'react-icons/fi';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function Packages() {
  const { packages } = useSiteContent();

  return (
    <>
      <PageHero
        title="Premium Build Packages"
        kicker="Transparent starting points"
        description="Choose a polished engagement model, then shape the scope with Nextec. Every package is admin-managed and reflected live from MongoDB."
        path="/packages"
      />

      <section className="section packages-stage">
        <div className="container">
          <SectionHeader
            eyebrow="Packages"
            title="Agency-grade delivery with clear momentum."
            text="Each package is designed to move from strategy to launch without losing the craft, animation, responsiveness, and backend reliability your site already depends on."
          />

          <div className="packages-grid">
            {packages.map((item, index) => (
              <PackageCard key={item.slug || item._id || item.title} item={item} index={index} />
            ))}
          </div>
          {!packages.length && (
            <div className="premium-card packages-empty">
              <h3>No packages published yet.</h3>
              <p>Create or activate packages from the admin panel under Packages, and they will appear here from MongoDB.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section tinted">
        <div className="container package-proof">
          {[
            ['Creative direction', 'Visual hierarchy, interaction polish, and responsive design systems.', FiLayers],
            ['MERN reliability', 'MongoDB content, Express APIs, and React experiences built to stay editable.', FiShield],
            ['Launch energy', 'Fast iteration, premium motion, and conversion-minded CTA flows.', FiZap]
          ].map(([title, text, Icon]) => (
            <article className="premium-card" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function PackageCard({ item, index }) {
  const features = [...(item.features || []), ...(item.deliverables || [])].slice(0, 8);
  const price = Number(item.price || 0).toLocaleString();

  return (
    <motion.article
      className={`package-card premium-card ${item.featured ? 'featured' : ''}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      <div className="package-glow" aria-hidden="true" />
      <div className="package-topline">
        <span className="eyebrow">{item.eyebrow || 'Package'}</span>
        {item.badge && <b>{item.badge}</b>}
      </div>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <div className="package-price">
        <span>{item.currency || '$'}</span>
        <strong>{price}</strong>
        <em>/{item.cadence || 'project'}</em>
      </div>
      <ul>
        {features.map((feature) => (
          <li key={feature}>
            <FiCheckCircle /> {feature}
          </li>
        ))}
      </ul>
      <Link className="btn primary package-cta" to={item.ctaHref || '/contact'}>
        {item.ctaLabel || 'Start Project'} <FiArrowRight />
      </Link>
    </motion.article>
  );
}
