import PropTypes from 'prop-types';
import QuickReply from '../quick-reply/QuickReply';  // Asegúrate de importar el componente QuickReply

export default function QuickReplies({ replyClick, quickReplies = [], text }) {

  // Manejador de click para cada respuesta rápida
  const handleClick = (event, payload, replyText, link) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (link) {
      // Si hay un link, lo abrimos en una nueva pestaña
      window.open(link, "_blank");
    } else {
      // Si no hay link, llamamos a replyClick con el payload
      replyClick(event, payload, replyText);  // Llama al callback con el payload y texto de la respuesta
    }
  };

  return (
    <div className="quick-replies">
      {/* Renderizamos el texto si está presente */}
      {text && <p>{text}</p>}

      {/* Renderizamos cada respuesta rápida */}
      {quickReplies.map((reply, index) => (
        <QuickReply
          key={index}
          reply={reply}
          click={(event) => handleClick(event, reply.payload, reply.text, reply.link)}  // Pasamos la función de clic y la respuesta
        />
      ))}
    </div>
  );
}

QuickReplies.propTypes = {
  replyClick: PropTypes.func.isRequired,  // Función que maneja el clic
  quickReplies: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      link: PropTypes.string,  // Puede tener un link (opcional)
    })
  ).isRequired,
  text: PropTypes.string,  // El texto del mensaje (opcional)
};
