export default function AppLoader({ label = 'Initializing Nextec', inline = false }) {
  return <div className={`app-loader ${inline ? 'inline' : ''}`} role="status" aria-live="polite"><div className="app-loader-mark">N<span>/</span>X</div><p>{label}</p><i /></div>;
}
