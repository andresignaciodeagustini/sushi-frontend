// about.jsx
import Header from '../../header/header';
import aboutImage from '../../../assets/img/about-us.jpg';
import './about.css';

export default function About() {
  return (
    <>
      <Header />
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h1 className="about-title">About Us</h1>
            <p className="about-paragraph">
              En <strong>Sushi Zen</strong>, te invitamos a vivir la perfecta armonía 
              entre la tradición japonesa y la innovación culinaria moderna...
            </p>
            <p className="about-paragraph">
              Con raíces en los valores atemporales de la artesanía japonesa, 
              <strong> Sushi Zen</strong> se inspira en la filosofía Zen...
            </p>
            {/* Agregamos el botón */}
            <button className="about-button">About Us</button>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="Sushi Zen Experience" />
          </div>
        </div>
      </div>
    </>
  );
}