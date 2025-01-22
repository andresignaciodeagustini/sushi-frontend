import Landing from './components/pages/landing/Landing';
import About from './components/pages/about/about'; 
import Chatbot from "./components/chatbot/chatbot"; 
import Contact from './components/pages/contact/contact'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Chatbot /> 
      <section id="landing" className="section">
        <Landing />
      </section>
      <section id="about" className="section">
        <About />
      </section>
      <section id="contact" className="section">
        <Contact />
      </section>
    </div>
  );
}

export default App;