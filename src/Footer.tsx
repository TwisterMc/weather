import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      Weather data provided by{' '}
      <a
        href="https://open-meteo.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="app-footer__link"
      >
        Open-Meteo
      </a>.
    </footer>
  );
}
