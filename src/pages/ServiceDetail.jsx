import { Link, useParams } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import PageHero from '../components/common/PageHero.jsx';
import ServiceCard from '../components/cards/ServiceCard.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { services } = useSiteContent();
  const service = services.find((item) => item.slug === slug) || services[0];
  const related = services.filter((item) => item.slug !== service?.slug).slice(0, 3);
  const deliverables = service?.deliverables?.length ? service.deliverables : ['Discovery', 'Design', 'Development', 'Launch support'];

  return (
    <>
      <PageHero title={service?.title} kicker={service?.category} description={service?.excerpt} path={`/services/${service?.slug}`} />
      <section className="section">
        <div className="container detail-grid">
          <img className="detail-image" src={service?.image} alt={service?.title} />
          <div className="premium-card detail-panel">
            <h2>Service Overview</h2>
            <p>{service?.description}</p>
            <ul>{deliverables.map((item) => <li key={item}><FiCheck />{item}</li>)}</ul>
            <Link className="btn primary" to="/contact">Request this service <FiArrowRight /></Link>
          </div>
        </div>
      </section>
      <section className="section tinted"><div className="container"><h2>Related Services</h2><div className="service-grid">{related.map((item) => <ServiceCard key={item.slug || item._id} service={item} />)}</div></div></section>
    </>
  );
}
