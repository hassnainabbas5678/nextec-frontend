import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

const fallbackImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';

export default function PortfolioCard({ item, onPreview, index = 0 }) {
  const image = item.image || fallbackImage;
  const isWebDevelopment = String(item.category || '').trim().toLowerCase() === 'web development';

  return (
    <motion.article className="portfolio-card premium-card" layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.03 }}>
      <button className="portfolio-preview" type="button" onClick={() => onPreview?.({ ...item, image })} aria-label={`Preview ${item.title}`}>
        <img src={image} alt={item.title} loading="lazy" />
      </button>
      <div className="card-body">
        <span>
          {item.category} · {item.year || '2026'}
        </span>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        {isWebDevelopment && item.liveUrl ? (
          <a className="live-project-link" href={item.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${item.title} live website in a new tab`}>
            Open Live <FiArrowUpRight />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
