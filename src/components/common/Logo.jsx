export default function Logo({ compact = false }) {
  return (
    <span className="logo-mark" aria-label="Nextec">
      <img className={`logo-image ${compact ? 'compact' : ''}`} src="/nextec-logo.png" alt="Nextec" />
    </span>
  );
}
