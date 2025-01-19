import Header from '../../header/header';
import contactImage from '../../../assets/img/contact.jpeg'; // Asegúrate de tener una imagen de contacto
import './contact.css';

export default function Contact() {
  return (
    <>
      <Header />
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-text">
            <h1 className="contact-title">Contáctanos</h1>
            
            <div className="contact-info">
              <div className="contact-section">
                <h2>Ubicación</h2>
                <p>Av. Libertadores 123</p>
                <p>Mar del Plata, Argentina</p>
              </div>

              
              <div className="contact-section">
            <h2>Horario</h2>
            <div className="schedule">
                <p className="schedule-item">
                <span className="days">Lunes a Viernes:</span>
                <span className="hours-group">
                    11:30 - 15:00 | 19:30 - 23:30
                </span>
                </p>
                <p className="schedule-item">
                <span className="days">Sábados y Domingos:</span>
                <span className="hours-group">
                    19:30 - 23:30
                </span>
                </p>
            </div>
            </div>
              <div className="contact-section">
                <h2>Contacto</h2>
                <p>Teléfono: (123) 456-7890</p>
                <p>Email: info@sushizen.com</p>
              </div>

              <form className="contact-form">
                <h2>Envíanos un mensaje</h2>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Nombre"
                    required
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    placeholder="Mensaje"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
          
          <div className="contact-image">
            <img src={contactImage} alt="Sushi Zen Contact" />
          </div>
        </div>
      </div>
    </>
  );
}