import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '../../services/api.js';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    key: 'site',
    siteName: 'Nextec',
    email: '',
    phoneUs: '',
    phoneUk: '',
    officeUs: '',
    officeUk: '',
    socials: { facebook: '', linkedin: '', instagram: '' },
    seo: { title: '', description: '', ogImage: '' }
  });
  const [id, setId] = useState(null);

  useEffect(() => {
    adminApi.list('settings').then((data) => {
      const current = data.items[0];
      if (current) {
        setId(current._id);
        setSettings((defaults) => ({ ...defaults, ...current, socials: { ...defaults.socials, ...current.socials }, seo: { ...defaults.seo, ...current.seo } }));
      }
    }).catch((error) => toast.error(error.message || 'Unable to load settings'));
  }, []);

  const update = (field, value) => setSettings((current) => ({ ...current, [field]: value }));
  const updateNested = (group, field, value) => setSettings((current) => ({ ...current, [group]: { ...current[group], [field]: value } }));
  const save = async (event) => {
    event.preventDefault();
    if (id) await adminApi.update('settings', id, settings);
    else {
      const created = await adminApi.create('settings', settings);
      setId(created._id);
    }
    toast.success('Site settings saved.');
  };

  return (
    <section className="admin-page">
      <h1>Site Settings CRUD</h1>
      <form className="premium-card admin-form" onSubmit={save}>
        <div className="form-grid two">
          <label>Site Name<input value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} /></label>
          <label>Email<input value={settings.email} onChange={(e) => update('email', e.target.value)} /></label>
          <label>US Phone<input value={settings.phoneUs} onChange={(e) => update('phoneUs', e.target.value)} /></label>
          <label>UK Phone<input value={settings.phoneUk} onChange={(e) => update('phoneUk', e.target.value)} /></label>
          <label className="wide">US Office<input value={settings.officeUs} onChange={(e) => update('officeUs', e.target.value)} /></label>
          <label className="wide">UK Office<input value={settings.officeUk} onChange={(e) => update('officeUk', e.target.value)} /></label>
          <label>Facebook<input value={settings.socials.facebook} onChange={(e) => updateNested('socials', 'facebook', e.target.value)} /></label>
          <label>LinkedIn<input value={settings.socials.linkedin} onChange={(e) => updateNested('socials', 'linkedin', e.target.value)} /></label>
          <label>Instagram<input value={settings.socials.instagram} onChange={(e) => updateNested('socials', 'instagram', e.target.value)} /></label>
          <label>SEO Title<input value={settings.seo.title} onChange={(e) => updateNested('seo', 'title', e.target.value)} /></label>
          <label className="wide">SEO Description<input value={settings.seo.description} onChange={(e) => updateNested('seo', 'description', e.target.value)} /></label>
          <label className="wide">Open Graph Image<input value={settings.seo.ogImage} onChange={(e) => updateNested('seo', 'ogImage', e.target.value)} /></label>
        </div>
        <button className="btn primary">Save Settings</button>
      </form>
    </section>
  );
}
