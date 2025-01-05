import PropTypes from 'prop-types';

const QuickReply = ({ reply, click }) => {
  const replyText = reply?.text || 'No reply text';

  const handleLinkClick = (e) => {
    e.preventDefault();
    const link = reply?.structValue?.fields?.link?.stringValue;
    if (link) {
      window.open(link, '_self');  // Abre en la misma ventana
    }
  };

  return (
    <div className="quick-reply">
      {!reply.payload ? (
        reply.structValue?.fields?.link?.stringValue ? (
          <a
            href={reply.structValue.fields.link.stringValue}  // Usa la estructura completa
            className="quick-reply-link"
            onClick={handleLinkClick}
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
    structValue: PropTypes.shape({
      fields: PropTypes.shape({
        link: PropTypes.shape({
          stringValue: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
  click: PropTypes.func.isRequired,
};

export default QuickReply;
