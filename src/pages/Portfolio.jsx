import { useMemo, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import PageHero from '../components/common/PageHero.jsx';
import PortfolioCard from '../components/cards/PortfolioCard.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

const categories = [
  'All',
  'Logo Designs',
  'Website Development',
  'Social Media Creatives',
  'Campaign Results',
  'SEO Results',
  'App Development',
  'Youtube Automation Performance'
];

const categoryAliases = {
  'Logo Designs': ['logo designs', 'branding', 'brand identity'],
  'Website Development': ['website development', 'website', 'websites', 'web design'],
  'Social Media Creatives': ['social media creatives', 'social media', 'social'],
  'Campaign Results': ['campaign results', 'campaign', 'marketing campaign'],
  'SEO Results': ['seo results', 'seo', 'search engine optimization'],
  'App Development': ['app development', 'application', 'applications', 'mobile app'],
  'Youtube Automation Performance': ['youtube automation performance', 'youtube automation', 'youtube']
};

export default function Portfolio() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(null);
  const { portfolio } = useSiteContent();
  const filtered = useMemo(() => portfolio.filter((item) => {
    const projectCategory = String(item.category || '').trim().toLowerCase();
    const matchesCategory = category === 'All' || categoryAliases[category]?.includes(projectCategory);
    return matchesCategory && String(item.title || '').toLowerCase().includes(query.toLowerCase());
  }), [category, portfolio, query]);

  return (
    <>
      <PageHero title="Our Creative Portfolio" kicker="Selected work" description="Search and filter recent Nextec projects across branding, websites, and applications." path="/portfolio" />
      <section className="section">
        <div className="container">
          <div className="portfolio-tools">
            <label><FiSearch /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" /></label>
            <div className="filter-row">{categories.map((item) => <button className={item === category ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
          </div>
          <div className="portfolio-grid masonry">{filtered.map((item, index) => <PortfolioCard key={item.slug || item._id} item={item} index={index} onPreview={setPreview} />)}</div>
        </div>
      </section>
      {preview && <div className="modal-backdrop" onClick={() => setPreview(null)}><div className="modal premium-card" onClick={(e) => e.stopPropagation()}><button className="icon-btn" onClick={() => setPreview(null)}><FiX /></button><img src={preview.image} alt={preview.title} /><h2>{preview.title}</h2><p>{preview.summary}</p></div></div>}
    </>
  );
}
