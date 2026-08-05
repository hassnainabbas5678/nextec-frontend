import PageHero from '../components/common/PageHero.jsx';
import ServiceCard from '../components/cards/ServiceCard.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function Services() {
  const { services } = useSiteContent();

  return (
    <>
      <PageHero title="All Services" kicker="What Nextec does" description="Explore professional services designed to support business growth and development." path="/services" />
      <section className="section">
        <div className="container">
          <div className="service-grid">{services.map((service, index) => <ServiceCard key={service.slug || service._id} service={service} index={index} />)}</div>
        </div>
      </section>
    </>
  );
}
