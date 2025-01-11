import PropTypes from 'prop-types';
import './Card.css';

const Card = (props) => {
  // Acceder directamente a header y description
  const { header, description } = props.payload;

  console.log("Props recibidos en Card:", props);  // Log para verificar los props

  return (
    <div style={{ height: 270, paddingRight: 30, float: 'left' }}>
      <div className="card">
        <div className="card-content">
          <span className="card-title">{header || 'Sin título'}</span>
          <p>{description || 'Sin descripción'}</p>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  payload: PropTypes.shape({
    header: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default Card;