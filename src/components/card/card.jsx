import PropTypes from 'prop-types';
import './Card.css';

const Card = (props) => {
  console.log("Props recibidos en Card:", props);  // Log para verificar los props

  return (
    <div style={{ height: 270, paddingRight: 30, float: 'left' }}>
      <div className="card">
        <div className="card-content">
          <span className="card-title">{props.payload.header || 'Sin título'}</span>
          <p>{props.payload.description || 'Sin descripción'}</p>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  payload: PropTypes.shape({
    header: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default Card;
