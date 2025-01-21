import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './chatbot.css';
import Card from '../card/card';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitializing] = useState(false);
  
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    const newVisibleState = !isVisible;
    setIsVisible(newVisibleState);
    if (newVisibleState && messages.length === 0) {
      setTimeout(() => {
        df_text_query("MenuPrincipal");
      }, 100);
    }
  };

  const updateMessages = (newMessage) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      try {
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      } catch {
        // Manejo silencioso del error
      }
      return updatedMessages;
    });
  };

  const df_text_query = async (queryText) => {
    let says = {
      speaks: 'user',
      msg: {
        text: queryText
      }
    };


    if (!queryText.startsWith('Menu') && !queryText.startsWith('Consulta') && 
        !queryText.startsWith('Buscar') && !queryText.startsWith('Hacer')) {
      updateMessages(says);
    }

    setInput("");
    setIsTyping(true);

    try {
      let sessionId = localStorage.getItem('dialogflowSessionId');
      if (!sessionId) {
        sessionId = 'session-' + Math.random().toString(36).substring(7);
        localStorage.setItem('dialogflowSessionId', sessionId);
      }

      if (queryText === "MenuPrincipal") {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/webhook`, {
          queryResult: {
            intent: {
              displayName: "MenuPrincipal"
            },
            outputContexts: []
          }
        });
        
        let allMessages = [];

        if (res.data.fulfillmentMessages) {
          res.data.fulfillmentMessages.forEach(message => {
            if (message.text && message.text.text) {
              message.text.text.forEach(text => {
                allMessages.push({
                  speaks: 'bot',
                  msg: {
                    text: text
                  }
                });
              });
            }

            if (message.payload) {
              allMessages.push({
                speaks: 'bot',
                msg: {
                  quickReplies: message.payload.data.map(reply => ({
                    title: reply.structValue.fields.text.stringValue,
                    payload: reply.structValue.fields.payload.stringValue
                  })),
                  text: message.payload.text
                }
              });
            }
          });
        }

        setMessages(prevMessages => [...prevMessages, ...allMessages]);
        return;
      }


      const res = await axios.post(`${import.meta.env.VITE_API_URL}/webhook`, {
        queryInput: {
          text: {
            text: queryText,
            languageCode: 'es'
          }
        },
        sessionId: sessionId
      });

      let allMessages = [];

      if (res.data.fulfillmentMessages) {
        res.data.fulfillmentMessages.forEach(message => {
          if (message.text && message.text.text) {
            message.text.text.forEach(text => {
              allMessages.push({
                speaks: 'bot',
                msg: {
                  text: text
                }
              });
            });
          }

          if (message.payload) {
            if (message.payload.quick_replies) {
              allMessages.push({
                speaks: 'bot',
                msg: {
                  quickReplies: message.payload.quick_replies.map(reply => ({
                    title: reply.text,
                    payload: reply.payload
                  })),
                  text: message.payload.text || "¿Qué te gustaría hacer?"
                }
              });
            }
            else if (message.payload.fields) {
              const fields = message.payload.fields;
              
              if (fields.type && fields.type.stringValue === 'quick_replies') {
                try {
                  const quickReplies = fields.data.listValue.values.map(item => {
                    const fieldsData = item.structValue.fields.structValue.structValue.fields.fields.structValue.fields;
                    return {
                      title: fieldsData.text.structValue.fields.stringValue.stringValue,
                      payload: fieldsData.payload.structValue.fields.stringValue.stringValue
                    };
                  });

                  allMessages.push({
                    speaks: 'bot',
                    msg: {
                      quickReplies: quickReplies,
                      text: fields.text.stringValue
                    }
                  });
                } catch {
                  // Manejo silencioso
                }
              }
              else if (fields.type && fields.type.stringValue === 'cards') {
                const cards = fields.data.listValue.values.map(item => ({
                  header: item.structValue.fields.header.stringValue,
                  description: item.structValue.fields.description.stringValue
                }));

                allMessages.push({
                  speaks: 'bot',
                  msg: {
                    payload: cards
                  }
                });
              }
            }
          }
        });
      }
      else if (res.data.messages && Array.isArray(res.data.messages)) {
        res.data.messages.forEach(message => {
          allMessages.push({
            speaks: 'bot',
            msg: {
              text: message.speech
            }
          });
        });
      } 
      else if (res.data.speech) {
        allMessages.push({
          speaks: 'bot',
          msg: {
            text: res.data.speech
          }
        });
      }

      setMessages(prevMessages => [...prevMessages, ...allMessages]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        speaks: 'bot',
        msg: {
          text: "Lo siento, hubo un problema al procesar tu solicitud. ¿Podrías intentarlo de nuevo?"
        }
      };
      updateMessages(errorMessage);
    } finally {
      setIsTyping(false);
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatbot-wrapper">
      <button 
        onClick={toggleChatbot} 
        className={`chatbot-toggle-button ${isVisible ? 'open' : ''}`}
        aria-label={isVisible ? 'Cerrar chat de ayuda' : 'Abrir chat de ayuda'}
      >
        {isVisible ? (
          'Cerrar chat'
        ) : (
          <>
            <span className="pulse-dot"></span>
            ¿Necesitas ayuda?
          </>
        )}
      </button>

      {isVisible && (
        <div className="chatbot-container">
          <div className="chatbot-box">
            <div className="chatbot-header">
              <h2>Sushi Zen Bot</h2>
            </div>

            <div className="chatbot-messages">
              {isInitializing ? (
                <div className="chatbot-message bot">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div key={index} className={`chatbot-message ${message.speaks}`}>
                      {message.msg.payload ? (
                        <div className="cards-container">
                          {message.msg.payload.map((card, i) => (
                            <Card key={i} payload={card} />
                          ))}
                        </div>
                      ) : message.msg.quickReplies ? (
                        <>
                          <div className="message-text">
                            {message.msg.text && <p>{typeof message.msg.text === 'string' ? message.msg.text : message.msg.text.text}</p>}
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
                        </>
                      ) : (
                        <p>{message.msg.text}</p>
                      )}
                    </div>
                  ))}
                </>
              )}
              {isTyping && !isInitializing && (
                <div className="chatbot-message bot typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                className="chatbot-input"
              />
              <button 
                onClick={() => input.trim() && df_text_query(input)}
                className="chatbot-send-button"
                disabled={!input.trim()}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}