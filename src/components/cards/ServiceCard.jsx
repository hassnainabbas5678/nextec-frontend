import { motion } from 'framer-motion';
import {
  FiActivity, FiCompass, FiGlobe, FiLayers, FiMessageCircle, FiPenTool,
  FiSearch, FiSliders, FiSmartphone, FiType, FiVideo, FiZap
} from 'react-icons/fi';

const serviceIcons = [
  FiActivity, FiGlobe, FiPenTool, FiLayers, FiMessageCircle, FiSearch,
  FiSliders, FiCompass, FiVideo, FiZap, FiSmartphone, FiType
];

export default function ServiceCard({ service, index = 0 }) {
  const Icon = serviceIcons[index % serviceIcons.length];

  return (
    <motion.article
      className="service-card premium-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.04, duration: 0.65 }}
    >
      <div className="service-card-inner">
        <div className="service-card-topline">
          <span className="service-icon" aria-hidden="true"><Icon /></span>
          <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="card-body">
          <span>{service.category}</span>
          <h3>{service.title}</h3>
          <p>{service.excerpt}</p>
        </div>
      </div>
    </motion.article>
  );
}
