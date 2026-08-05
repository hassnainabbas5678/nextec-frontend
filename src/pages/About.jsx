import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { FiHeart, FiTarget, FiUsers, FiZap } from 'react-icons/fi';
import PageHero from '../components/common/PageHero.jsx';
import SectionHeader from '../components/common/SectionHeader.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function About() {
  const { services, team } = useSiteContent();

  return (
    <>
      <PageHero title="About Nextec" kicker="Digital excellence" description="Crafting digital excellence through innovative design, production-grade engineering, and growth systems." path="/about" />
      <section className="section">
        <div className="container about-grid">
          <div>
            <SectionHeader
              eyebrow="Our Story"
              title="A premium software house for teams that care about detail."
              text="Nextec blends product strategy, refined interface design, MERN engineering, automation, and marketing execution into one connected delivery system."
            />
            <p>Our designers, developers, marketers, and operators work together so your website, admin panel, content, APIs, and growth systems feel like one polished product.</p>
            <div className="mini-values">
              <span>
                <FiTarget /> Our Mission
                <br />
                <small>Deliver useful digital systems that scale.</small>
              </span>
              <span>
                <FiHeart /> Our Standard
                <br />
                <small>Make every touchpoint feel intentional.</small>
              </span>
            </div>
          </div>
          <div className="premium-card service-list">
            <h3>Capabilities</h3>
            {services.slice(0, 4).map((service) => (
              <article key={service.slug || service._id}>
                <h4>{service.title}</h4>
                <p>{service.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {!!team.length && (
        <section className="section tinted">
          <div className="container">
            <SectionHeader center title="The Team" text="Admin-managed team members appear here automatically." />
            <div className="values-grid">
              {team.map((member) => (
                <article className="premium-card team-card" key={member._id || member.name}>
                  {member.image ? <img src={member.image} alt={member.name} loading="lazy" /> : <FiUsers />}
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <small>{member.bio}</small>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section tinted">
        <div className="container">
          <SectionHeader center title="Why Choose Us" text="We combine creative taste with stable implementation and measurable delivery." />
          <div className="values-grid">
            {[
              ['Quality Excellence', 'Every project receives careful UI, performance, API, and deployment attention.'],
              ['Client Focused', 'Content, admin workflows, and launch details are shaped around real business use.'],
              ['Results Driven', 'We build digital products that improve credibility, conversion, and operations.']
            ].map(([title, text]) => (
              <div className="premium-card value-card" key={title}>
                <FiZap />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container timeline">
          <SectionHeader eyebrow="Achievements" title="A practical record of momentum." />
          {['Discovery-led strategy', 'Premium web delivery', 'Global operations', 'Growth systems'].map((item, index) => (
            <div className="timeline-item" key={item}>
              <span>
                <CountUp end={(index + 1) * 25} suffix="%" enableScrollSpy />
              </span>
              <h3>{item}</h3>
              <p>Built through focused collaboration, delivery discipline, and a high bar for user experience.</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CountUp({ end, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    const controls = motion.animate(value, end, { duration: 1.4, ease: 'easeOut' });
    return () => controls.stop();
  }, [end, isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
