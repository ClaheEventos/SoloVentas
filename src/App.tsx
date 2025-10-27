import { useState } from "react";
import EventForm from './components/EventForm';
import CuotasComponent from './components/CuotasComponent';
import Adicionales from './components/FormularioAdicionales';

import './App.css';

function App() {
  const [activeComponent, setActiveComponent] = useState("event"); // 'event', 'cuotas', 'adicionales'

  return (
    <div className="App">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <header>
        <h1>Solo Ventas</h1>
      </header>

      {/* Botones de navegación */}
  <div className="button-group">
  <button
    className={activeComponent === "event" ? "active" : ""}
    onClick={() => setActiveComponent("event")}
  >
    Formulario Evento
  </button>
  <button
    className={activeComponent === "cuotas" ? "active" : ""}
    onClick={() => setActiveComponent("cuotas")}
  >
    Cuotas
  </button>
  <button
    className={activeComponent === "adicionales" ? "active" : ""}
    onClick={() => setActiveComponent("adicionales")}
  >
    Adicionales
  </button>
</div>

      <main>
        {activeComponent === "event" && <EventForm />}
        {activeComponent === "cuotas" && <CuotasComponent />}
        {activeComponent === "adicionales" && <Adicionales />}
      </main>
    </div>
  );
}

export default App;
