// header.jsx
import { Link } from "react-router-dom";
import logo from '../../assets/img/logo.png'; 
import './header.css'; 

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/"> {/* El logo redirigirá a la página principal/landing */}
            <img src={logo} alt="Sushi Zen Logo" className="logo" />
          </Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li><Link to="/">INICIO</Link></li>
            <li><Link to="/about">NOSOTROS</Link></li>
            <li><Link to="/contact">CONTACTO</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}