import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Chatbot.css';
import Card from '../card/card';
import QuickReplies from '../quick-replies/QuickReplies';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const welcomeSent = useRef(false);
  const messagesEndRef = useRef(null);
  const isMounted = useRef(true);  // Para evitar actualizaciones de estado después de que el componente se haya desmontado.

  const toggleChatbot = () => {
    setIsVisible(!isVisible);
  };

  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      try {
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages)); 
      } catch (error) {
        console.error("Error al guardar los mensajes en localStorage:", error);
      }
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
    setInput("");

    try {
      const res = await axios.post('http://localhost:5000/api/df_text_query', { text: queryText });
      
      let allMessages = [];
      if (res.data.fulfillmentText) {
        says = {
          speaks: 'bot',
          msg: {
            text: {
              text: res.data.fulfillmentText
            }
          }
        };
        allMessages.push(says);
      }

      if (res.data.payloads) {
        res.data.payloads.forEach((payload) => {
          if (payload.type === 'cards') {
            const cards = payload.data.map(item => ({
              header: item.structValue.fields.header.stringValue,
              description: item.structValue.fields.description.stringValue
            }));

            says = {
              speaks: 'bot',
              msg: {
                payload: cards
              }
            };
            allMessages.push(says);
          } else if (payload.type === 'quick_replies') {
            const quickReplies = payload.data.map(item => {
              const text = item.structValue.fields.text.stringValue;
              const payload = item.structValue.fields.payload?.stringValue ?? text;
              const link = item.structValue.fields.link?.stringValue ?? "http://www.defaultlink.com";
              return {
                title: text,
                payload: payload,
                link: link
              };
            });

            says = {
              speaks: 'bot',
              msg: {
                quickReplies: quickReplies
              }
            };
            allMessages.push(says);
          } else if (payload.type === 'text') {
            says = {
              speaks: 'bot',
              msg: {
                text: payload.data
              }
            };
            allMessages.push(says);
          }
        });
      }

      allMessages.forEach((message) => updateMessages(message));
    } catch (error) {
      console.error('Error al enviar el mensaje', error);
    }
  };

  const _handleQuickReplyPayload = async (event, payload, text) => {
    event.preventDefault();
    event.stopPropagation();
    await df_text_query(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      df_text_query(input);
    }
  };

  useEffect(() => {
    isMounted.current = true;  // Marcar que el componente está montado
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages)); 
      } catch (error) {
        console.error("Error al parsear los mensajes de localStorage", error);
      }
    } else if (!welcomeSent.current) {
      df_text_query("¡Hola! ¿En qué puedo ayudarte hoy?");
      welcomeSent.current = true;
    }

    return () => {
      isMounted.current = false;  // Marcar que el componente se desmontó
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      <button onClick={toggleChatbot} className="chatbot-toggle-button">
        {isVisible ? 'Cerrar Chatbot' : 'Abrir Chatbot'}
      </button>

      {isVisible && (
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
                      <div className="cards-container">
                        {message.msg.payload.map((card, i) => (
                          <Card key={i} payload={card} />
                        ))}
                      </div>
                    </div>
                  );
                }

                if (message.msg.quickReplies) {
                  return (
                    <div key={index} className="chatbot-message bot">
                      <div className="message-text">
                        {message.msg.text && <p>{message.msg.text}</p>}
                      </div>
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
                  <div
                    key={index}
                    className={`chatbot-message ${message.speaks === "user" ? "user" : "bot"}`}
                  >
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
          </div>
        </div>
      )}
    </div>
  );
}