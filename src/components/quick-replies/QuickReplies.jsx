import PropTypes from 'prop-types';
import QuickReply from '../quick-reply/QuickReply';  // Asegúrate de importar el componente QuickReply

export default function QuickReplies({ replyClick, quickReplies = [], text }) {
  // Manejador de click para cada respuesta rápida
  const handleClick = (event, payload, replyText, link) => {
    event.preventDefault();
    event.stopPropagation();

    if (link) {
      // Si es un link, no lo abrimos, sino que lo enviamos al chat
      replyClick(event, link);  // Se envía el link como parte del flujo del chat
    } else {
      // Si no es un link, llamamos a replyClick con el payload y texto de la respuesta
      replyClick(event, payload, replyText);
    }
  };

  return (
    <div className="quick-replies">
      {/* Renderizamos el texto principal si está presente, o un mensaje predeterminado si no lo está */}
      <p>{text || "No se recibió el mensaje"}</p>

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
      payload: PropTypes.string.isRequired,  // Cada respuesta rápida tiene un payload
      text: PropTypes.string.isRequired,     // Texto que se mostrará
      link: PropTypes.string,                // Link opcional
    })
  ).isRequired,
  text: PropTypes.string.isRequired,  // Texto opcional para la pregunta o mensaje
};