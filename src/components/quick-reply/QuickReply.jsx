import PropTypes from 'prop-types';

const QuickReply = ({ reply, click }) => {
  const replyText = reply?.text || 'No reply text';

  const handleLinkClick = (e) => {
    e.preventDefault();
    const link = reply?.link; 

    if (link) {
      
      click(e, null, null, link);  
    }
  };

  return (
    <div className="quick-reply">
      {!reply.payload ? (
        reply.link ? (
          
          <a
            href={reply.link}
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
    link: PropTypes.string, 
  }).isRequired,
  click: PropTypes.func.isRequired,
};

export default QuickReply;
