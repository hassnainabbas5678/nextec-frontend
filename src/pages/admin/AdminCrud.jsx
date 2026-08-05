import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowDown, FiArrowUp, FiEdit2, FiFilter, FiImage, FiPlus, FiSearch, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import { adminApi } from '../../services/api.js';

const resourceConfig = {
  heroes: {
    title: 'Hero',
    fields: ['title', 'eyebrow', 'subtitle', 'image', 'primaryCta.label', 'primaryCta.href', 'secondaryCta.label', 'secondaryCta.href', 'stats', 'status']
  },
  services: { title: 'Services', fields: ['title', 'slug', 'category', 'excerpt', 'description', 'image', 'deliverables', 'order', 'status'] },
  portfolio: { title: 'Portfolio', fields: ['title', 'slug', 'category', 'summary', 'description', 'image', 'liveUrl', 'gallery', 'services', 'year', 'client', 'featured', 'status'] },
  packages: { title: 'Packages', fields: ['title', 'slug', 'eyebrow', 'badge', 'description', 'price', 'currency', 'cadence', 'features', 'deliverables', 'ctaLabel', 'ctaHref', 'featured', 'order', 'status'] },
  team: { title: 'Team', fields: ['name', 'role', 'bio', 'image', 'order', 'status'] },
  testimonials: { title: 'Testimonials', fields: ['name', 'role', 'quote', 'rating', 'status'] },
  faqs: { title: 'FAQ', fields: ['question', 'answer', 'category', 'order', 'status'] },
  ebooks: { title: 'Ebook', fields: ['title', 'slug', 'subtitle', 'price', 'benefits', 'features', 'previewUrl', 'checkoutUrl', 'status'] },
  messages: { title: 'Contact Messages', fields: ['name', 'email', 'subject', 'message', 'source', 'status'] },
  subscribers: { title: 'Newsletter Subscribers', fields: ['name', 'email', 'status'] },
  media: { title: 'Media Library', fields: ['url', 'publicId', 'format', 'status'] }
};

const longFields = new Set(['subtitle', 'description', 'message', 'answer', 'quote', 'bio', 'summary', 'excerpt', 'benefits', 'features', 'deliverables', 'gallery', 'services', 'stats']);
const requiredFields = new Set(['title', 'name', 'email', 'subject', 'message', 'question', 'answer', 'category', 'excerpt', 'description', 'summary']);

export default function AdminCrud() {
  const { resource = 'services' } = useParams();
  const config = resourceConfig[resource] || { title: resource, fields: ['title', 'status'] };
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ status: '', category: '', source: '' });
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  const load = async (page = meta.page) => {
    setBusy(true);
    try {
      const data = await adminApi.list(resource, { page, search: query, ...activeFilters(filters) });
      setItems(data.items);
      setMeta(data.meta);
    } catch (error) {
      toast.error(error.message || 'Unable to load resource');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    setEditing(null);
    setSelected([]);
    setMeta({ page: 1, pages: 1, total: 0 });
    load(1);
    // Resource switches should refresh immediately; search/filter reloads stay behind the Apply button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const categoryOptions = useMemo(() => [...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const imageField = config.fields.find((field) => field === 'image' || field === 'url');

  const edit = (item = {}) => {
    setEditing(item._id || 'new');
    setForm(flattenForForm(item));
  };

  const save = async (event) => {
    event.preventDefault();
    const error = validateForm(resource, config.fields, form);
    if (error) {
      toast.error(error);
      return;
    }

    const payload = expandForm(form);
    try {
      if (editing === 'new') await adminApi.create(resource, payload);
      else await adminApi.update(resource, editing, payload);
      toast.success('Saved successfully.');
      notifyContentUpdated();
      setEditing(null);
      setForm({});
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed.');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item permanently?')) return;
    await adminApi.remove(resource, id);
    notifyContentUpdated();
    toast.success('Deleted.');
    load();
  };

  const toggleStatus = async (item) => {
    const current = item.status || 'published';
    const options = statusOptions(resource);
    const next = current === options[0] ? options[1] : options[0];
    await adminApi.update(resource, item._id, { status: next });
    notifyContentUpdated();
    toast.success(next === 'published' ? 'Activated.' : 'Deactivated.');
    load();
  };

  const reorderPackage = async (index, direction) => {
    const targetIndex = index + direction;
    const current = items[index];
    const target = items[targetIndex];
    if (!current || !target) return;
    const currentOrder = Number(current.order ?? index);
    const targetOrder = Number(target.order ?? targetIndex);
    await Promise.all([
      adminApi.update(resource, current._id, { order: targetOrder }),
      adminApi.update(resource, target._id, { order: currentOrder })
    ]);
    notifyContentUpdated();
    toast.success('Package order updated.');
    load();
  };

  const bulkDelete = async () => {
    if (!selected.length || !window.confirm(`Delete ${selected.length} selected item(s)?`)) return;
    await adminApi.bulk(resource, { action: 'delete', ids: selected });
    notifyContentUpdated();
    setSelected([]);
    toast.success('Bulk action completed.');
    load();
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    try {
      const data = await adminApi.upload(body);
      setForm((current) => ({ ...current, [imageField || 'image']: data.url }));
      toast.success('Uploaded to media library.');
    } catch (error) {
      toast.error(error.message || 'Upload failed.');
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-toolbar admin-hero-row">
        <div>
          <span className="eyebrow">Admin CRUD</span>
          <h1>{config.title}</h1>
          <p>{meta.total || 0} record(s) connected to MongoDB.</p>
        </div>
        <button className="btn primary" type="button" onClick={() => edit()}>
          <FiPlus /> New
        </button>
      </div>

      <div className="premium-card admin-filters">
        <label className="admin-search">
          <FiSearch />
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load(1)} placeholder="Search records" />
        </label>
        <label>
          <FiFilter /> Status
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
            <option value="">All</option>
            {statusOptions(resource).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
            <option value="">All</option>
            {categoryOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <button className="btn ghost" type="button" onClick={() => load(1)}>Apply</button>
        <button className="btn ghost danger" type="button" disabled={!selected.length} onClick={bulkDelete}>
          <FiTrash2 /> Bulk Delete
        </button>
      </div>

      {editing && (
        <form className="premium-card admin-form" onSubmit={save}>
          <div className="admin-form-title">
            <h2>{editing === 'new' ? 'Create' : 'Edit'} {config.title}</h2>
            <button className="icon-btn" type="button" onClick={() => setEditing(null)} aria-label="Close form">
              <FiX />
            </button>
          </div>
          <div className="form-grid two">
            {config.fields.map((field) => (
              <AdminField key={field} resource={resource} field={field} value={form[field] ?? ''} onChange={(value) => setForm((current) => ({ ...current, [field]: value }))} />
            ))}
          </div>
          {imageField && (
            <div className="media-manager">
              <label className="upload-field">
                <FiUpload /> Upload image
                <input type="file" accept="image/*" onChange={upload} />
              </label>
              {form[imageField] ? (
                <div className="media-preview">
                  <img src={form[imageField]} alt="Selected media preview" />
                  <button className="btn ghost" type="button" onClick={() => setForm((current) => ({ ...current, [imageField]: '' }))}>
                    <FiTrash2 /> Remove image
                  </button>
                </div>
              ) : (
                <div className="media-empty"><FiImage /> No image selected</div>
              )}
            </div>
          )}
          <div className="form-actions">
            <button className="btn primary">Save</button>
            <button className="btn ghost" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table premium-card">
        {busy ? <p>Loading records...</p> : (
          <table>
            <thead>
              <tr><th></th><th>Title</th><th>Category / Email</th><th>Status</th><th>Updated</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id}>
                  <td><input type="checkbox" checked={selected.includes(item._id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, item._id] : current.filter((id) => id !== item._id))} /></td>
                  <td>{item.title || item.name || item.question || item.subject || item.url}</td>
                  <td>{item.category || item.email || item.role || item.source}</td>
                  <td><span className={`status-pill ${item.status || 'published'}`}>{statusLabel(resource, item.status || 'published')}</span></td>
                  <td>{new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td>
                    {resource === 'packages' && <button type="button" disabled={index === 0} onClick={() => reorderPackage(index, -1)} aria-label="Move package up"><FiArrowUp /></button>}
                    {resource === 'packages' && <button type="button" disabled={index === items.length - 1} onClick={() => reorderPackage(index, 1)} aria-label="Move package down"><FiArrowDown /></button>}
                    <button type="button" onClick={() => edit(item)} aria-label="Edit"><FiEdit2 /></button>
                    <button type="button" onClick={() => toggleStatus(item)} aria-label="Toggle active state">{(item.status || 'published') === statusOptions(resource)[0] ? 'Off' : 'On'}</button>
                    <button type="button" onClick={() => remove(item._id)} aria-label="Delete"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan="6">No records found.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      <div className="pagination">
        <button disabled={meta.page <= 1} onClick={() => load(meta.page - 1)}>Previous</button>
        <span>{meta.page} / {meta.pages}</span>
        <button disabled={meta.page >= meta.pages} onClick={() => load(meta.page + 1)}>Next</button>
      </div>
    </section>
  );
}

function AdminField({ resource, field, value, onChange }) {
  const label = field.replaceAll('.', ' ');
  const className = longFields.has(field) ? 'wide' : '';
  if (field === 'status') {
    return (
      <label className={className}>{label}
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">Default</option>
          {statusOptions(resource).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
    );
  }
  if (field === 'featured') {
    return (
      <label>{label}
        <select value={String(value || false)} onChange={(event) => onChange(event.target.value)}>
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </label>
    );
  }
  if (longFields.has(field)) {
    return <label className={className}>{label}<textarea rows="5" value={value} onChange={(event) => onChange(event.target.value)} placeholder={arrayFieldHint(field)} /></label>;
  }
  return <label className={className}>{label}<input value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function flattenForForm(item) {
  const flat = { ...item };
  ['primaryCta', 'secondaryCta'].forEach((group) => {
    if (item[group]) {
      flat[`${group}.label`] = item[group].label || '';
      flat[`${group}.href`] = item[group].href || '';
    }
  });
  ['deliverables', 'services', 'benefits', 'features', 'gallery'].forEach((field) => {
    if (Array.isArray(item[field])) flat[field] = item[field].join('\n');
  });
  if (Array.isArray(item.stats)) flat.stats = item.stats.map((stat) => `${stat.value} | ${stat.label}`).join('\n');
  return flat;
}

function expandForm(form) {
  const payload = {};
  Object.entries(form).forEach(([key, value]) => {
    if (key.startsWith('_') || ['createdAt', 'updatedAt', '__v'].includes(key)) return;
    if (key.includes('.')) {
      const [group, field] = key.split('.');
      payload[group] = { ...(payload[group] || {}), [field]: value };
      return;
    }
    payload[key] = value;
  });
  if (typeof payload.stats === 'string') {
    payload.stats = payload.stats.split('\n').map((line) => {
      const [value, label] = line.split('|').map((part) => part?.trim());
      return value && label ? { value, label } : null;
    }).filter(Boolean);
  }
  return payload;
}

function activeFilters(filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
}

function statusOptions(resource) {
  return ['messages', 'subscribers'].includes(resource) ? ['new', 'read', 'archived'] : ['published', 'draft'];
}

function statusLabel(resource, status) {
  if (resource === 'packages') return status === 'published' ? 'active' : 'inactive';
  return status;
}

function arrayFieldHint(field) {
  if (field === 'stats') return 'One per line: 80+ | Completed projects';
  if (['deliverables', 'services', 'benefits', 'features', 'gallery'].includes(field)) return 'One item per line';
  return '';
}

function validateForm(resource, fields, form) {
  const required = fields.filter((field) => requiredFields.has(field));
  const missing = required.find((field) => !String(form[field] || '').trim());
  if (resource !== 'media' && missing) return `${missing.replaceAll('.', ' ')} is required.`;
  if (resource === 'packages' && (form.price === undefined || form.price === '' || Number.isNaN(Number(form.price)))) return 'price is required.';
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return 'A valid email is required.';
  return '';
}

function notifyContentUpdated() {
  window.dispatchEvent(new window.Event('nextec:content-updated'));
}
