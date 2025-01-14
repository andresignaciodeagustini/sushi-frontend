import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ payload }) => {
  const { header, description, image, type = 'primary' } = payload;

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
          <button className="card-button">
            Ver más
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
    type: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  }).isRequired,
};

export default Card;