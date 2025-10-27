import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import './EventForm.css';

interface FormData {
  salon: string;
  fechaEvento: string;
  tipoEvento: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: string;
  nombreHomenajeado: string;
  tel1: string;
  nombreTel1: string;
  tel2: string;
  nombreTel2: string;
  direccion: string;
  cuil: string;
  correo: string;
  tipoPlanPromocion: string;
  detallePago: string;
  importeAbono: string;
  medioPago: string;
  resto: string;
  fechaLimite: string;
  regalo: 'si' | 'no';
  cualRegalo: string;
  proximaEntrevista: string;
  observacion: string;
  equipo: string;
  foto: string;
}

const initialFormData: FormData = {
  salon: '',
  fechaEvento: '',
  tipoEvento: '',
  horaInicio: '',
  horaFin: '',
  cantidadPersonas: '',
  nombreHomenajeado: '',
  tel1: '',
  nombreTel1: '',
  tel2: '',
  nombreTel2: '',
  direccion: '',
  cuil: '',
  correo: '',
  tipoPlanPromocion: '',
  detallePago: '',
  importeAbono: '',
  medioPago: '',
  resto: '',
  fechaLimite: '',
  regalo: 'no',
  cualRegalo: '',
  proximaEntrevista: '',
  observacion: '',
  equipo: '',
  foto: '',
};

export default function EventForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // 👉 Manejar cambios de texto / select / textarea
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 👉 Capturar imagen (foto del comprobante)
  const handlePhotoCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData(prev => ({ ...prev, foto: base64String }));
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // 👉 Eliminar foto
  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, foto: '' }));
    setPhotoPreview(null);
  };

  // 👉 Enviar formulario a Apps Script
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const formBody = new FormData();

      // Identificador del formulario (para Apps Script)
      formBody.append("tipoFormulario", "gerencia");

      // 🔧 Mapeo de campos que cambian nombre entre el form y Apps Script
      const nameMap: Record<string, string> = {
        tipoPlanPromocion: "plan",
        importeAbono: "importeAbonado",
        observacion: "observaciones",
        foto: "fotoComprobante",
      };

      // Pasar todos los campos
      Object.entries(formData).forEach(([key, value]) => {
        const finalKey = nameMap[key] || key;
        formBody.append(finalKey, String(value));
      });

      // 👉 URL de tu Apps Script (ya funcional)
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby4sFsydXJp-5NjiyC0U0KkYM5sV6_zUUMo0EB9U7r5yxH89DseBO8j_RKljMiozUn-/exec",
        { method: "POST", body: formBody }
      );

      const result = await response.json();

      if (result.status === "success") {
        setMessage({ type: "success", text: "✅ Reserva guardada exitosamente" });
        setFormData(initialFormData);
        setPhotoPreview(null);
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: "error", text: `❌ Error: ${result.message}` });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error: ${
          error instanceof Error ? error.message : "Error de conexión"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="modern-event-form" onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="form-header">
          <h1>Formulario SOLO VENTAS</h1>
        </div>

        {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

        <div className="form-section">
          <div className="section-header">
            <h2>Datos del Evento</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
  <label>Salón *</label>
  <select
    name="salon"
    value={formData.salon}
    onChange={handleChange}
    required
    disabled={isLoading}
  >
    <option value="">-- Seleccionar salón --</option>
    <option value="Salón 1">Salón 1</option>
    <option value="Salón B">Salón B</option>
    <option value="Salón C">Salón C</option>
    <option value="Salón D">Salón D</option>
  </select>
</div>

            <div className="form-group">
              <label>Fecha del Evento *</label>
              <input type="date" name="fechaEvento" value={formData.fechaEvento} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Tipo de Evento</label>
              <input type="text" name="tipoEvento" value={formData.tipoEvento} onChange={handleChange} placeholder="Cumpleaños, Matrimonio, etc" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Hora de Inicio</label>
              <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Hora de Fin</label>
              <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Cantidad de Personas *</label>
              <input type="number" name="cantidadPersonas" value={formData.cantidadPersonas} onChange={handleChange} min="1" placeholder="50" required disabled={isLoading} />
            </div>
            <div className="form-group full-width">
              <label>Nombre del Homenajeado</label>
              <input type="text" name="nombreHomenajeado" value={formData.nombreHomenajeado} onChange={handleChange} placeholder="Nombre completo" disabled={isLoading} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Datos de Contacto</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Teléfono 1</label>
              <input type="tel" name="tel1" value={formData.tel1} onChange={handleChange} placeholder="+54 (11) 1234-5678" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Nombre del Contacto 1</label>
              <input type="text" name="nombreTel1" value={formData.nombreTel1} onChange={handleChange} placeholder="Nombre" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Teléfono 2</label>
              <input type="tel" name="tel2" value={formData.tel2} onChange={handleChange} placeholder="+54 (11) 1234-5678" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Nombre del Contacto 2</label>
              <input type="text" name="nombreTel2" value={formData.nombreTel2} onChange={handleChange} placeholder="Nombre" disabled={isLoading} />
            </div>
            <div className="form-group full-width">
              <label>Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, número, ciudad" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>CUIL</label>
              <input type="text" name="cuil" value={formData.cuil} onChange={handleChange} placeholder="XX-XXXXXXXXX-X" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="correo@ejemplo.com" disabled={isLoading} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Detalles de Pago</h2>
          </div>
          <div className="form-grid">
<div className="form-grid">
  <div className="form-group">
    <label>Tipo de Plan/Promoción</label>
    <select
      name="tipoPlanPromocion"
      value={formData.tipoPlanPromocion}
      onChange={handleChange}
      disabled={isLoading}
    >
      <option value="">-- Seleccionar plan --</option>
      <option value="Plan Gold">Plan Gold</option>
      <option value="Plan Silver">Plan Silver</option>
      <option value="Plan Bronze">Plan Bronze</option>
      <option value="Plan Básico">Plan Básico</option>
    </select>
  </div>

  <div className="form-group">
    <label>Medio de Pago</label>
    <select
      name="medioPago"
      value={formData.medioPago}
      onChange={handleChange}
      disabled={isLoading}
    >
      <option value="">-- Seleccionar medio --</option>
      <option value="Efectivo">Efectivo</option>
      <option value="Transferencia">Transferencia</option>
      <option value="Tarjeta">Tarjeta</option>
      <option value="Mercado Pago">Mercado Pago</option>
    </select>
  </div>
</div>
            <div className="form-group">
              <label>Importe de Abono</label>
              <input type="number" name="importeAbono" value={formData.importeAbono} onChange={handleChange} min="0" step="0.01" placeholder="0.00" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Resto (a pagar)</label>
              <input type="number" name="resto" value={formData.resto} onChange={handleChange} min="0" step="0.01" placeholder="0.00" disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Fecha Límite (pago)</label>
              <input type="date" name="fechaLimite" value={formData.fechaLimite} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="form-group full-width">
              <label>Detalle del Pago</label>
              <textarea name="detallePago" value={formData.detallePago} onChange={handleChange} placeholder="Descripción de lo incluido en el pago" rows={3} disabled={isLoading} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Información Adicional</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>¿Regalo?</label>
              <select name="regalo" value={formData.regalo} onChange={handleChange} disabled={isLoading}>
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>
            {formData.regalo === 'si' && (
              <div className="form-group">
                <label>¿Cuál Regalo? *</label>
                <input type="text" name="cualRegalo" value={formData.cualRegalo} onChange={handleChange} placeholder="Especificar regalo" required disabled={isLoading} />
              </div>
            )}
            <div className="form-group">
              <label>Próxima Entrevista</label>
              <input type="datetime-local" name="proximaEntrevista" value={formData.proximaEntrevista} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="form-group">
  <label>Equipo Asignado</label>
  <select
    name="equipo"
    value={formData.equipo}
    onChange={handleChange}
    disabled={isLoading}
  >
    <option value="">-- Seleccionar equipo --</option>
    <option value="Equipo A">Equipo A</option>
    <option value="Equipo B">Equipo B</option>
    <option value="Equipo C">Equipo C</option>
    <option value="Equipo Ventas">Equipo Ventas</option>
    <option value="Equipo Producción">Equipo Producción</option>
  </select>
</div>
            <div className="form-group full-width">
              <label>Observaciones</label>
              <textarea name="observacion" value={formData.observacion} onChange={handleChange} placeholder="Notas adicionales o especificaciones" rows={4} disabled={isLoading} />
            </div>

            <div className="form-group full-width">
              <label>📸 Foto del Evento</label>
              <div className="photo-upload-container">
                <input 
                  type="file" 
                  name="foto" 
                  accept="image/*" 
                  onChange={handlePhotoCapture}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                  id="photo-input"
                />
                <label htmlFor="photo-input" className="photo-upload-label">
                  📤 Seleccionar Foto
                </label>
              </div>
              {photoPreview && (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" className="preview-img" />
                  <button 
                    type="button" 
                    onClick={handleRemovePhoto} 
                    className="btn-remove-photo"
                    disabled={isLoading}
                  >
                    ❌ Eliminar Foto
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '⏳ Guardando...' : '✓ Guardar Reserva'}
          </button>
          <button type="button" className="btn-reset" onClick={() => { setFormData(initialFormData); setPhotoPreview(null); setMessage(null); }} disabled={isLoading}>
            ↻ Limpiar Formulario
          </button>
        </div>
      </div>
    </form>
  );
}