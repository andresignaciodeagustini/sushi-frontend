import { useState, useEffect } from 'react';
import './header.css'; 

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        {isScrolled && (
          <div onClick={() => scrollToSection('landing')} className="logo">
            Sushi Zen
          </div>
        )}
        <nav className="nav">
          <ul className="nav-list">
            <li><a onClick={() => scrollToSection('landing')} href="#landing">INICIO</a></li>
            <li><a onClick={() => scrollToSection('about')} href="#about">NOSOTROS</a></li>
            <li><a onClick={() => scrollToSection('contact')} href="#contact">CONTACTO</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}