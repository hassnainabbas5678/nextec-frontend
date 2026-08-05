import { motion } from 'framer-motion';
import SEO from '../../utils/seo.js';

export default function PageHero({ title, kicker, description, path }) {
  return (
    <>
      <SEO title={title} description={description} path={path} />
      <section className={`page-hero page-hero-${path?.replaceAll('/', '') || 'default'}`}>
        <span className="page-hero-index" aria-hidden="true">NXT / {String(title).slice(0, 2).toUpperCase()} / 26</span>
        <span className="page-hero-orbit" aria-hidden="true" />
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="container narrow">
          {kicker && <span className="eyebrow">{kicker}</span>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <span className="page-hero-meta">SYSTEMS WITH INTENTION</span>
        </motion.div>
      </section>
    </>
  );
}
