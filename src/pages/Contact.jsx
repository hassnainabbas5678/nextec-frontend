import { FiGlobe, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import PageHero from '../components/common/PageHero.jsx';
import ContactForm from '../components/forms/ContactForm.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

export default function Contact() {
  const { settings } = useSiteContent();

  return (
    <>
      <PageHero title="Get In Touch" kicker="Contact Nextec" description="We'd love to hear from you. Let's start a conversation." path="/contact" />
      <section className="section">
        <div className="container contact-grid">
          <div>
            <h2>Contact Information</h2>
            <p>Reach out through any of these channels. We're here to help with your digital needs.</p>
            <div className="contact-lines">
              <span>
                <FiMapPin /> <b>Our Location</b>
                {settings.officeUs}
              </span>
              <span>
                <FiMail /> <b>Email Us</b>
                {settings.salesEmail}
              </span>
              <span>
                <FiPhone /> <b>Call</b>
                {settings.phoneUs}
              </span>
              <span>
                <FiGlobe /> <b>Global Presence</b>
                US Head Office · UK Branch
              </span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <section className="section tinted">
        <div className="container">
          <h2 className="center-text">Find Us Here</h2>
          <div className="map-frame">
            <iframe title="Nextec Kearny Map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Kearny%2C%20NJ%2C%20USA&output=embed" />
          </div>
        </div>
      </section>
    </>
  );
}
