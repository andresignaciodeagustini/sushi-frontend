import PropTypes from 'prop-types';
import QuickReply from '../quick-reply/QuickReply';  

export default function QuickReplies({ replyClick, quickReplies = [], text }) {
  
  const handleClick = (event, payload, replyText, link) => {
    event.preventDefault();
    event.stopPropagation();

    if (link) {
      
      replyClick(event, link);  
    } else {
      
      replyClick(event, payload, replyText);
    }
  };

  return (
    <div className="quick-replies">
      
      <p>{text || "No se recibió el mensaje"}</p>

    
      {quickReplies.map((reply, index) => (
        <QuickReply
          key={index}
          reply={reply}
          click={(event) => handleClick(event, reply.payload, reply.text, reply.link)} 
        />
      ))}
    </div>
  );
}

QuickReplies.propTypes = {
  replyClick: PropTypes.func.isRequired, 
  quickReplies: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.string.isRequired,  
      text: PropTypes.string.isRequired,     
      link: PropTypes.string,               
    })
  ).isRequired,
  text: PropTypes.string.isRequired,  
};