import { useParams } from 'react-router-dom';
import PageHero from '../components/common/PageHero.jsx';
import PortfolioCard from '../components/cards/PortfolioCard.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function PortfolioDetail() {
  const { slug } = useParams();
  const { portfolio } = useSiteContent();
  const item = portfolio.find((project) => project.slug === slug) || portfolio[0];
  const related = portfolio.filter((project) => project.slug !== item?.slug).slice(0, 3);
  const services = item?.services?.length ? item.services : ['Design', 'Development', 'SEO'];
  return (
    <>
      <PageHero title={item?.title} kicker={item?.category} description={item?.summary} path={`/portfolio/${item?.slug}`} />
      <section className="section"><div className="container detail-grid"><img className="detail-image" src={item?.image} alt={item?.title} /><div className="premium-card detail-panel"><h2>Project Scope</h2><p>{item?.description || item?.summary}</p><ul>{services.map((service) => <li key={service}>{service}</li>)}</ul><p>Delivered in {item?.year || '2026'} with a focus on clean presentation, stronger credibility, and improved conversion flow.</p></div></div></section>
      <section className="section tinted"><div className="container"><h2>Related projects</h2><div className="portfolio-grid compact">{related.map((project) => <PortfolioCard key={project.slug || project._id} item={project} onPreview={() => {}} />)}</div></div></section>
    </>
  );
}
