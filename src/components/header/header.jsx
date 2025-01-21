// header.jsx
import { Link } from "react-router-dom";

import './header.css'; 

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        
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