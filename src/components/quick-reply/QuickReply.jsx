import PropTypes from 'prop-types';

const QuickReply = ({ reply, click }) => {
  const replyText = reply?.text || 'No reply text';

  const handleLinkClick = (e) => {
    e.preventDefault();
    const link = reply?.link; // Usamos el link directamente aquí

    if (link) {
      // No abrir en una nueva ventana, sino enviar el link al chat
      click(e, null, null, link);  // Enviamos el link al chat
    }
  };

  return (
    <div className="quick-reply">
      {!reply.payload ? (
        reply.link ? (
          // Si tiene un link, renderizamos un enlace clickable
          <a
            href={reply.link}
            className="quick-reply-link"
            onClick={handleLinkClick}  // Acción personalizada para enviar el link al chat
          >
            {replyText}
          </a>
        ) : (
          <button onClick={click} className="quick-reply-button">
            {replyText}
          </button>
        )
      ) : (
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
    payload: PropTypes.string,
    link: PropTypes.string,  // Aseguramos que puede tener un link
  }).isRequired,
  click: PropTypes.func.isRequired,
};

export default QuickReply;
