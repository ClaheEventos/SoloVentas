import { useState } from "react";
import type { FC } from "react";

interface LoginProps {
  onLoginSuccess: () => void;
}

interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  tipo: string;
}

const LoginVentas: FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://48p82xms-8002.brs.devtunnels.ms/api/ventas/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await res.json();

      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", data.username);
        localStorage.setItem("tipo", data.tipo);

        onLoginSuccess();
      } else {
        setError((data as any).detail || "Usuario o contraseña incorrecta");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión con el servidor");
    }
  };

  // Estilos inline
const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "40px",
    backgroundColor: "#111", // fondo negro
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(255, 255, 0, 0.2)", // sombra amarilla tenue
    textAlign: "center" as const,
    fontFamily: "Arial, sans-serif",
    color: "#FFD700", // texto principal amarillo
  },
  title: {
    marginBottom: "25px",
    color: "#FFD700", // título amarillo
    fontSize: "28px",
    fontWeight: "bold" as const,
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #FFD700", // borde amarillo
    backgroundColor: "#222", // input oscuro
    color: "#FFD700", // texto amarillo
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#FFD700", // botón amarillo
    color: "#111", // texto oscuro en botón
    fontSize: "16px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#e6c200", // amarillo más oscuro al hover
  },
  error: {
    marginTop: "15px",
    color: "#FF4500", // rojo anaranjado para errores
    fontWeight: "bold" as const,
    fontSize: "14px",
  },
};
;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login Ventas</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>
          Ingresar
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default LoginVentas;
