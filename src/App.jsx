import { Route, Routes } from "react-router-dom";
import Landing from './components/pages/landing/Landing';
import About from './components/pages/about/about'; 
import Shop from './components/shop/shop';   
import Chatbot from "./components/chatbot/chatbot"; // Asegúrate de que la ruta y el nombre sean correctos

import './App.css';

function App() {
  return (
    <>
      <Chatbot /> {/* Este componente se muestra en todas las páginas */}
      
      <Routes>
        <Route path="/" element={<Landing />} />          {/* Página de inicio */}
        <Route path="/about" element={<About />} />       {/* Página Acerca de */}
        <Route path="/shop" element={<Shop />} />         {/* Página Tienda */}
      </Routes>
    </>
  );
}

export default App;
