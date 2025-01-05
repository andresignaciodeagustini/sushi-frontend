import PropTypes from 'prop-types';

const QuickReply = ({ reply, click }) => {
  // Usamos el texto de la respuesta
  const replyText = reply?.text || 'No reply text';

  return (
    <div className="quick-reply">
      {/* Si la respuesta tiene un enlace, mostramos un <a> */}
      {reply.link ? (
        <a href={reply.link} target="_blank" rel="noopener noreferrer" className="quick-reply-link">
          {replyText}
        </a>
      ) : (
        // Si no tiene link, mostramos un <button>
        <button onClick={click} className="quick-reply-button">
          {replyText}
        </button>
      )}
    </div>
  );
};

QuickReply.propTypes = {
  reply: PropTypes.shape({
    text: PropTypes.string.isRequired,
    payload: PropTypes.string.isRequired,
    link: PropTypes.string,  // Link es opcional
  }).isRequired,
  click: PropTypes.func.isRequired,  // La función de clic es obligatoria
};

export default QuickReply;
