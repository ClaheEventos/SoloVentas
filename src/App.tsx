import { useState, useEffect } from "react";
import EventForm from './components/EventForm';
import CuotasComponent from './components/CuotasComponent';
import Adicionales from './components/FormularioAdicionales';
import LoginVentas from './components/LoginVentas';

import './App.css';

type ActiveComponent = "event" | "cuotas" | "adicionales";

function App() {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("event");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Revisar localStorage al cargar la app
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.clear(); // borrar tokens y datos
    setIsLoggedIn(false);
  };

  // 💅 Estilos del botón
  const logoutButtonStyle: React.CSSProperties = {
    float: "right",
    margin: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#ffffffff", // amarillo fuerte
    color: "#111", // texto oscuro
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 4px 10px rgba(255, 215, 0, 0.4)",
    transition: "all 0.3s ease",
  };

  const logoutButtonHoverStyle: React.CSSProperties = {
    backgroundColor: "#e6c200",
    boxShadow: "0 6px 14px rgba(255, 215, 0, 0.6)",
    transform: "scale(1.05)",
  };

  const [isHovered, setIsHovered] = useState(false);

  if (!isLoggedIn) {
    return <LoginVentas onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <header>
        <h1>Solo Ventas</h1>
        <button
          onClick={handleLogout}
          style={{
            ...logoutButtonStyle,
            ...(isHovered ? logoutButtonHoverStyle : {}),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
           Cerrar sesión
        </button>
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
