import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Chatbot.css';
import Card from '../card/card';
import QuickReplies from '../quick-replies/QuickReplies'; // Asegúrate de importar el componente de respuestas rápidas

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const welcomeSent = useRef(false);
  const messagesEndRef = useRef(null);

  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const df_text_query = async (queryText) => {
    let says = {
      speaks: 'user',
      msg: {
        text: {
          text: queryText
        }
      }
    };

    updateMessages(says);
    setInput(""); // Limpiamos el input

    try {
      const res = await axios.post('http://localhost:5000/api/df_text_query', { text: queryText });

      let textProcessed = false;
      let processedCards = false;

      if (res.data.fulfillmentText) {
        says = {
          speaks: 'bot',
          msg: {
            text: {
              text: res.data.fulfillmentText
            }
          }
        };
        updateMessages(says);
        textProcessed = true;
      }

      if (res.data.fulfillmentMessages) {
        res.data.fulfillmentMessages.forEach((message) => {
          // Procesamiento de tarjetas
          if (message.payload && message.payload.fields && message.payload.fields.cards && !processedCards) {
            const cards = message.payload.fields.cards.listValue.values.map(item => ({
              header: item.structValue.fields.header.stringValue,
              description: item.structValue.fields.description.stringValue
            }));

            says = {
              speaks: 'bot',
              msg: {
                payload: cards
              }
            };
            updateMessages(says);
            processedCards = true;
          }

          // Respuestas rápidas
          else if (message.payload && message.payload.fields) {
            // Verificamos si hay un campo `text` que es el mensaje principal
            const mainText = message.payload.fields.text?.stringValue ?? ''; // Si no hay texto, asignamos un valor vacío
          
            // Extraemos las respuestas rápidas
            const quickReplies = message.payload.fields.quick_replies?.listValue.values.map(item => {
              const text = item.structValue.fields.text?.stringValue ?? '';  // Si no hay texto, asignamos ''
              let payload = item.structValue.fields.payload?.stringValue ?? text;  // Si no hay payload, usar el texto
              let link = item.structValue.fields.link?.stringValue ?? null;  // Link nulo si no está presente
          
              // Si no hay link, asignar un link por defecto (puedes ajustar esto según tus necesidades)
              if (!link) {
                link = "http://www.defaultlink.com";  // Asigna un link predeterminado si no existe
              }
          
              return {
                title: text,  // El texto que aparecerá en el botón
                payload: payload,  // El payload asociado con el botón
                link: link  // El link, si es que está presente
              };
            }) ?? [];
          
            // Estructuramos la respuesta para incluir tanto el texto principal como las respuestas rápidas
            const says = {
              speaks: 'bot',
              msg: {
                text: mainText,  // Aquí agregamos el texto principal (por ejemplo, "¿Quieres información?")
                quickReplies: quickReplies  // Las respuestas rápidas
              }
            };
          
            // Actualizamos los mensajes con la respuesta generada
            updateMessages(says); // En lugar de mostrar el texto del botón, simplemente enviamos las respuestas rápidas
          }

          // Respuesta de texto
          else if (message.text && !textProcessed) {
            const msgText = message.text.text[0];
            const says = {
              speaks: 'bot',
              msg: {
                text: {
                  text: msgText
                }
              }
            };
            updateMessages(says);
            textProcessed = true;
          }
        });
      }
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    }
  };

  const _handleQuickReplyPayload = (event, payload,text) => {
    event.preventDefault();
    event.stopPropagation();
    df_text_query(text); // Llamada a la función df_text_query para procesar la respuesta rápida
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      df_text_query(input);
    }
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else if (!welcomeSent.current) {
      df_text_query("¡Hola! ¿En qué puedo ayudarte hoy?");
      welcomeSent.current = true;
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chatbot-header">
          <h2>Chatbot</h2>
        </div>

        <div className="chatbot-messages">
  {messages.map((message, index) => {
    // Si el mensaje tiene 'payload', se renderiza de forma especial
    if (message.msg.payload) {
      return (
        <div key={index} className="chatbot-message bot">
          <div className="card-panel">
            <div className="col s2">
              <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
            </div>
            <div className="cards-container">
              {message.msg.payload.map((card, i) => (
                <Card key={i} payload={card} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Si el mensaje tiene 'quickReplies'
    if (message.msg.quickReplies) {
      return (
        <div key={index} className="chatbot-message bot">
          <div className="message-text">
            {/* Asegúrate de que 'message.msg.text' existe antes de renderizar */}
            {message.msg.text && <p>{message.msg.text}</p>} {/* Mostrar la pregunta antes de las respuestas rápidas */}
          </div>
          
          <div className="quick-replies">
            {message.msg.quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={(event) => _handleQuickReplyPayload(event, reply.payload, reply.title, reply.link)}
                className="quick-reply-button"
              >
                {reply.title}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Si no hay payload ni quickReplies, se muestra el mensaje simple
    return (
      <div key={index} className={`chatbot-message ${message.speaks === "user" ? "user" : "bot"}`}>
        {message.msg.text ? message.msg.text.text : message.msg}
      </div>
    );
  })}

  <div ref={messagesEndRef} />
</div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="chatbot-input"
        />

        {/* Renderizamos las respuestas rápidas aquí */}
        <QuickReplies replyClick={_handleQuickReplyPayload} />
      </div>
    </div>
  );
}
