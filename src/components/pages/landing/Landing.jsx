import Header from '../../header/header';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <Header />
        <h1>Bienvenido a la Página de Inicio</h1>
        <p>Explora nuestra tienda y descubre nuevos productos.</p>
      </div>
    </div>
  );
}