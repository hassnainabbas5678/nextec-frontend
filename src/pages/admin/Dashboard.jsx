import { useEffect, useState } from 'react';
// import CountUp from 'react-countup';
import { adminApi } from '../../services/api.js';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminApi.analytics().then(setData).catch(() => setData(null));
  }, []);

  const cards = data?.cards || [];

  return (
    <section className="admin-page">
      <div className="admin-toolbar admin-hero-row">
        <div>
          <span className="eyebrow">Nextec command center</span>
          <h1>Dashboard</h1>
          <p>Track live MongoDB content, contact activity, media uploads, and public website resources.</p>
        </div>
      </div>
      <div className="admin-stats">
        {cards.map((card) => (
          <article className="premium-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
      <div className="admin-grid">
        <article className="premium-card">
          <h2>System Health</h2>
          <p>Admin CRUD, public bootstrap content, authentication, Cloudinary uploads, and contact submissions are connected through the existing Express API.</p>
        </article>
        <article className="premium-card">
          <h2>Recent Activity</h2>
          {(data?.activity || []).map((item) => (
            <p key={item._id}>{item.action} · {item.resource} · {new Date(item.createdAt).toLocaleString()}</p>
          ))}
          {!data?.activity?.length && <p>No activity recorded yet.</p>}
        </article>
      </div>
    </section>
  );
}
