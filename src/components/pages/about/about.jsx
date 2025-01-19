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
            <h1 className="about-title">Bienvenidos a Sushi Zen</h1>

            <p className="about-paragraph">
              En <strong>Sushi Zen</strong>, te invitamos a vivir la perfecta armonía 
              entre la tradición japonesa y la innovación culinaria moderna. Nuestro 
              restaurante es una celebración del arte del sushi, elaborado con pasión 
              y precisión, donde cada bocado te transporta a un viaje de sabores y texturas.
            </p>

            <p className="about-paragraph">
              Con raíces en los valores atemporales de la artesanía japonesa, 
              <strong> Sushi Zen</strong> se inspira en la filosofía Zen de equilibrio, 
              simplicidad y paz. Creemos que la comida no solo debe nutrir el cuerpo, 
              sino también el alma, creando un ambiente donde cada momento se convierte 
              en una tranquila escapatoria del bullicio cotidiano.
            </p>

          </div>
          <div className="about-image">
            <img src={aboutImage} alt="Sushi Zen Experience" />
          </div>
        </div>
      </div>
    </>
  );
}