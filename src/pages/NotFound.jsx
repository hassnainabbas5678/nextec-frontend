import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="section not-found"><h1>Page not found</h1><p>The page you requested is not available.</p><Link className="btn primary" to="/">Return home</Link></section>;
}
