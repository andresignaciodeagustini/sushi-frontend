import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ payload, onSendMessage }) => {
  const { header, description, image, price, type = 'primary' } = payload;


  const handleClick = () => {
    if (onSendMessage) {
      onSendMessage(header);
    }
  };

  return (
    <div className="card-container">
      <div className={`card ${type}`}>
        {image && (
          <div className="card-image">
            <img src={image} alt={header} />
          </div>
        )}
        <div className="card-content">
          <span className="card-title">{header || 'Sin título'}</span>
          <p>{description || 'Sin descripción'}</p>
          {price && (
            <span className="card-price">${price}</span>  
          )}
          <button className="card-button" onClick={handleClick}>
            {header || 'Ver más'}
          </button>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  payload: PropTypes.shape({
    header: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.string,  
    type: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  }).isRequired,
  onSendMessage: PropTypes.func.isRequired, 
};

export default Card;
