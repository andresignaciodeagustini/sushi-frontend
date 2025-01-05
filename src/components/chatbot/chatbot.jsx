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
          // Respuestas rápidas
    else if (message.payload && message.payload.fields && message.payload.fields.quick_replies) {
      const quickReplies = message.payload.fields.quick_replies.listValue.values.map(item => {
        const text = item.structValue.fields.text ? item.structValue.fields.text.stringValue : '';
        let payload = item.structValue.fields.payload ? item.structValue.fields.payload.stringValue : '';
        let link = item.structValue.fields.link ? item.structValue.fields.link.stringValue : null; // Link si está presente

        // Si no tiene payload o link, asignar valores predeterminados
        if (!payload) {
          payload = text;  // Asignar el texto como payload por defecto
        }
        if (!link) {
          link = "http://www.defaultlink.com";  // Asignar un link por defecto si no existe
        }

        return {
          title: text, // El texto que aparecerá en el botón
          payload: payload, // El payload asociado con el botón
          link: link // El link, si es que está presente
        };
      });

      says = {
        speaks: 'bot',
        msg: {
          quickReplies
        }
      };
      updateMessages(says);
    }
          // Respuesta de texto
          else if (message.text && !textProcessed) {
            const msgText = message.text.text[0];
            says = {
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

  const _handleQuickReplyPayload = (event, payload, text) => {
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

            if (message.msg.quickReplies) {
              return (
                <div key={index} className="chatbot-message bot">
                  <div className="quick-replies">
                    {message.msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={(event) => _handleQuickReplyPayload(event, reply.payload, reply.title)}
                        className="quick-reply-button"
                      >
                        {reply.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

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
