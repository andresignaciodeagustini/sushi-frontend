import { Route, Routes } from "react-router-dom";
import Landing from './components/pages/landing/Landing';
import About from './components/pages/about/about'; 
import Shop from './components/shop/shop';   
import Chatbot from "./components/chatbot/chatbot"; 
import Contact from './components/pages/contact/contact'; 

import './App.css';

function App() {
  return (
    <>
      <Chatbot /> 
      
      <Routes>
        <Route path="/" element={<Landing />} />          
        <Route path="/about" element={<About />} />      
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />       
      </Routes>
    </>
  );
}

export default App;