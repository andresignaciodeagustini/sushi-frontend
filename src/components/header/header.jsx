import { Link } from "react-router-dom";
import './Header.css'; 

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Acerca de</Link></li>
          <li><Link to="/shop">Tienda</Link></li>
          <li><Link to="/contact">Contacto</Link></li>
          
        </ul>
      </nav>
    </header>
  );
}
