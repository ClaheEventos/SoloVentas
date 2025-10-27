// src/components/FormularioCuotas.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./EventForm.css";

interface Cuota {
  monto: string;
  fecha: string;
}

interface FormData {
  salon: string;
  fechaEvento: string;
  tipoEvento: string;
  nombreHomenajeado: string;
  familiar: string;
  tel1: string;
  nombreTel1: string;
  tel2: string;
  nombreTel2: string;
  direccion: string;
  cuil: string;
  correo: string;
  detallePago: string;
  importeAbonado: string;
  resto: string;
  medioPago: string;
  cuota: Cuota;
  observaciones: string;
  equipo: string;
  fotoComprobante: File | null;
}

const initialFormData: FormData = {
  salon: "",
  fechaEvento: "",
  tipoEvento: "",
  nombreHomenajeado: "",
  familiar: "",
  tel1: "",
  nombreTel1: "",
  tel2: "",
  nombreTel2: "",
  direccion: "",
  cuil: "",
  correo: "",
  detallePago: "",
  importeAbonado: "",
  resto: "",
  medioPago: "",
  cuota: { monto: "", fecha: "" },
  observaciones: "",
  equipo: "",
  fotoComprobante: null,
};

export default function FormularioCuotas() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "montoCuota" || name === "fechaCuota") {
      setFormData(prev => ({ ...prev, cuota: { ...prev.cuota, [name === "montoCuota" ? "monto" : "fecha"]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, fotoComprobante: file }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const formBody = new FormData();
      formBody.append("tipoFormulario", "cuotas");

      // Campos básicos
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "fotoComprobante" && key !== "cuota") {
          formBody.append(key, String(value));
        }
      });

      // Cuota en array JSON
      if (formData.cuota.monto && formData.cuota.fecha) {
        formBody.append("cuotas", JSON.stringify([formData.cuota]));
      }

      // Adjuntar imagen
      if (formData.fotoComprobante) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.fotoComprobante!);
        });
        const base64 = await base64Promise;
        formBody.append("fotoComprobante", base64);
      }

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby4sFsydXJp-5NjiyC0U0KkYM5sV6_zUUMo0EB9U7r5yxH89DseBO8j_RKljMiozUn-/exec",
        { method: "POST", body: formBody }
      );

      const result = await response.json();
      if (result.status === "success") {
        setMessage({ type: "success", text: "✅ Cuota guardada exitosamente" });
        setFormData(initialFormData);
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: "error", text: `❌ Error: ${result.message}` });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error: ${error instanceof Error ? error.message : "Error de conexión"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-event-form">
      <div className="form-container">
        <div className="form-header">
          <h1>Gestión de Cuotas</h1>
          <p>Registre el pago de una cuota del evento</p>
        </div>

        {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          {/* Datos del Evento */}
          <div className="form-section">
            <div className="section-header"><h2>Datos del Evento</h2></div>
            <div className="form-grid">
              <div className="form-group">
                <label>Salón *</label>
                <input type="text" name="salon" value={formData.salon} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Fecha del Evento *</label>
                <input type="date" name="fechaEvento" value={formData.fechaEvento} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Tipo de Evento</label>
                <input type="text" name="tipoEvento" value={formData.tipoEvento} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Nombre del Homenajeado</label>
                <input type="text" name="nombreHomenajeado" value={formData.nombreHomenajeado} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Familiar Contacto</label>
                <input type="text" name="familiar" value={formData.familiar} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
          </div>

          {/* Datos de Contacto */}
          <div className="form-section">
            <div className="section-header"><h2>Datos de Contacto</h2></div>
            <div className="form-grid">
              <div className="form-group">
                <label>Teléfono 1</label>
                <input type="tel" name="tel1" value={formData.tel1} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Nombre del Contacto 1</label>
                <input type="text" name="nombreTel1" value={formData.nombreTel1} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Teléfono 2</label>
                <input type="tel" name="tel2" value={formData.tel2} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Nombre del Contacto 2</label>
                <input type="text" name="nombreTel2" value={formData.nombreTel2} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group full-width">
                <label>Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>CUIL</label>
                <input type="text" name="cuil" value={formData.cuil} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
          </div>

          {/* Detalle de Pago */}
          <div className="form-section">
            <div className="section-header"><h2>Detalle de Pago</h2></div>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Detalle del Pago</label>
                <textarea name="detallePago" value={formData.detallePago} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Importe Abonado</label>
                <input type="number" name="importeAbonado" value={formData.importeAbonado} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Resto</label>
                <input type="number" name="resto" value={formData.resto} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Medio de Pago</label>
                <select name="medioPago" value={formData.medioPago} onChange={handleChange} disabled={isLoading}>
                  <option value="">-- Seleccione --</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cuota */}
          <div className="form-section">
            <div className="section-header"><h2>Datos de la Cuota</h2></div>
            <div className="form-grid">
              <div className="form-group">
                <label>Monto de la Cuota</label>
                <input type="number" name="montoCuota" placeholder="Ej: 50000" value={formData.cuota.monto} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input type="date" name="fechaCuota" value={formData.cuota.fecha} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
          </div>

          {/* Otros Detalles */}
          <div className="form-section">
            <div className="section-header"><h2>Otros Detalles</h2></div>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Observaciones</label>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Equipo Asignado</label>
                <input type="text" name="equipo" value={formData.equipo} onChange={handleChange} disabled={isLoading} />
              </div>
            </div>
          </div>

          {/* Comprobante */}
          <div className="form-section">
            <div className="section-header"><h2>Comprobante de Pago (opcional)</h2></div>
            <div className="form-group full-width">
              <input type="file" name="fotoComprobante" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
              {formData.fotoComprobante && (
                <img src={URL.createObjectURL(formData.fotoComprobante)} alt="Comprobante" style={{ maxWidth: "200px", marginTop: "10px" }} />
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="submit" disabled={isLoading}>{isLoading ? "⏳ Guardando..." : "✅ Guardar Cuota"}</button>
            <button type="button" onClick={() => setFormData(initialFormData)} disabled={isLoading}>🔄 Limpiar Formulario</button>
          </div>
        </form>
      </div>
    </div>
  );
}