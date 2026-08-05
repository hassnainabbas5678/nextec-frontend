export default function Logo({ compact = false }) {
  return (
    <span className="logo-mark" aria-label="Nextec">
      <span className="logo-symbol">N</span>
      {!compact && <span className="logo-text">NEXTEC</span>}
    </span>
  );
}
