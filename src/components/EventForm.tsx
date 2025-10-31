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
  foto: string; // La foto en base64
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
  foto: '', // Inicialmente vacío
};

export default function EventForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      };
      reader.readAsDataURL(file);
    }
    // Para manejar la limpieza si se cancela la selección
    if (!file && !formData.foto) {
        setFormData(prev => ({ ...prev, foto: '' }));
    }
  };

  // 👉 Eliminar foto
  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, foto: '' }));
  };

  // 👉 Enviar formulario a Apps Script
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // **********************************************
    // 🛑 VALIDACIÓN DE FOTO OBLIGATORIA
    // **********************************************
    if (!formData.foto) {
      setMessage({ type: 'error', text: '❌ ERROR: La foto del comprobante es obligatoria para guardar la reserva.' });
      setIsLoading(false);
      return; // Detiene el envío del formulario
    }
    // **********************************************
    
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
        // Mensaje de éxito muy visible y claro
        setMessage({ type: "success", text: "✅ RESERVA GUARDADA EXITOSAMENTE Y FOTO PROCESADA" });
        setFormData(initialFormData);
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

 

        {/* -------------------- SECCIONES DEL FORMULARIO -------------------- */}
        
        <div className="form-section">
          <div className="section-header"><h2>Datos del Evento</h2></div>
          <div className="form-grid">
            <div className="form-group">
              <label>Salón *</label>
              <select name="salon" value={formData.salon} onChange={handleChange} required disabled={isLoading}>
                <option value="">-- Seleccionar salón --</option>
                
<option value="Varela">Varela</option>
<option value="Varela II">Varela II</option>
<option value="Berazategui">Berazategui</option>
<option value="Monteverde">Monteverde</option>
<option value="París">París</option>
<option value="Dream's">Dream's</option>
<option value="Melody">Melody</option>
<option value="Luxor">Luxor</option>
<option value="Bernal">Bernal</option>
<option value="Sol Fest">Sol Fest</option>
<option value="Clahe">Clahe</option>
<option value="Onix">Onix</option>
<option value="Auguri">Auguri</option>
<option value="Dominico II">Dominico II</option>
<option value="Gala">Gala</option>
<option value="Sarandí II">Sarandí II</option>
<option value="Garufa">Garufa</option>
<option value="Lomas">Lomas</option>
<option value="Temperley">Temperley</option>
<option value="Clahe Escalada">Clahe Escalada</option>
<option value="Piñeyro">Piñeyro</option>
<option value="Monte Grande">Monte Grande</option>
<option value="Arcoiris">Arcoiris</option>
<option value="Varela III">Varela III</option>
<option value="Green House">Green House</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha del Evento *</label>
              <input type="date" name="fechaEvento" value={formData.fechaEvento} onChange={handleChange} required disabled={isLoading} />
            </div>
<div className="form-group">
  <label>Tipo de Evento</label>
  <select
    name="tipoEvento"
    value={formData.tipoEvento}
    onChange={handleChange}
    disabled={isLoading}
  >
    <option value="">-- Seleccionar tipo de evento --</option>
    <option value="Cumpleaños de 15">Cumpleaños de 15</option>
    <option value="Boda">Boda</option>
    <option value="Aniversario">Aniversario</option>
    <option value="Bautismo">Bautismo</option>
    <option value="Evento Empresarial">Evento Empresarial</option>
    <option value="Fiesta de Egresados">Fiesta de Egresados</option>
    <option value="1 añito">1 añito</option>
    <option value="15 años">15 años</option>
    <option value="18 años">18 años</option>
    <option value="Decada">30 Decada</option>
    <option value="Casamiento">Casamiento</option>
    <option value="Otro">Otro</option>
  </select>
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
          <div className="section-header"><h2>Datos de Contacto</h2></div>
          <div className="form-grid">
            <div className="form-group"><label>Teléfono 1</label><input type="tel" name="tel1" value={formData.tel1} onChange={handleChange} placeholder="+54 (11) 1234-5678" disabled={isLoading} /></div>
            <div className="form-group"><label>Nombre del Contacto 1</label><input type="text" name="nombreTel1" value={formData.nombreTel1} onChange={handleChange} placeholder="Nombre" disabled={isLoading} /></div>
            <div className="form-group"><label>Teléfono 2</label><input type="tel" name="tel2" value={formData.tel2} onChange={handleChange} placeholder="+54 (11) 1234-5678" disabled={isLoading} /></div>
            <div className="form-group"><label>Nombre del Contacto 2</label><input type="text" name="nombreTel2" value={formData.nombreTel2} onChange={handleChange} placeholder="Nombre" disabled={isLoading} /></div>
            <div className="form-group full-width"><label>Dirección</label><input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, número, ciudad" disabled={isLoading} /></div>
            <div className="form-group"><label>CUIL</label><input type="text" name="cuil" value={formData.cuil} onChange={handleChange} placeholder="XX-XXXXXXXXX-X" disabled={isLoading} /></div>
            <div className="form-group"><label>Correo Electrónico</label><input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="correo@ejemplo.com" disabled={isLoading} /></div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header"><h2>Detalles de Pago</h2></div>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Plan/Promoción</label>
              <select name="tipoPlanPromocion" value={formData.tipoPlanPromocion} onChange={handleChange} disabled={isLoading}>
                <option value="">-- Seleccionar plan --</option>
                <option value="Plan Gold">Plan Gold</option>
                <option value="Plan Silver">Plan Plata</option>
                <option value="Plan Bronze">All Inclusive </option>
              </select>
            </div>
            <div className="form-group">
              <label>Medio de Pago</label>
              <select name="medioPago" value={formData.medioPago} onChange={handleChange} disabled={isLoading}>
                <option value="">-- Seleccionar medio --</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Devito">Devito</option>
                <option value="Credito">Credito</option>
                <option value="QR">QR</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Mercado Pago">Otro</option>
              </select>
            </div>
            <div className="form-group"><label>Importe de Abono</label><input type="number" name="importeAbono" value={formData.importeAbono} onChange={handleChange} min="0" step="0.01" placeholder="0.00" disabled={isLoading} /></div>
            <div className="form-group"><label>Resto (a pagar)</label><input type="number" name="resto" value={formData.resto} onChange={handleChange} min="0" step="0.01" placeholder="0.00" disabled={isLoading} /></div>
            <div className="form-group"><label>Fecha Límite (pago)</label><input type="date" name="fechaLimite" value={formData.fechaLimite} onChange={handleChange} disabled={isLoading} /></div>
            <div className="form-group full-width"><label>Detalle del Pago</label><textarea name="detallePago" value={formData.detallePago} onChange={handleChange} placeholder="Descripción de lo incluido en el pago" rows={3} disabled={isLoading} /></div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header"><h2>Información Adicional</h2></div>
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
  <select name="equipo" value={formData.equipo} onChange={handleChange} disabled={isLoading}> 
    <option value="">-- Seleccionar equipo --</option>
    
    {/* Equipos de la primera imagen */}
    <option value="LUXOR I">LUXOR I</option>
    <option value="SARANDI III">SARANDI III</option>
    <option value="TEMPERLEY">TEMPERLEY</option>
    <option value="MELODY">MELODY</option>
    <option value="DOMINICO">DOMINICO</option>
    <option value="DOMINICO II">DOMINICO II</option>
    <option value="DREAM'S">DREAM'S</option>
    <option value="EQUIPO 11">EQUIPO 11</option>
    <option value="GALA">GALA</option>
    <option value="AVELLANEDA">AVELLANEDA</option>
    <option value="EQUIPO 6">EQUIPO 6</option>
    <option value="EQUIPO 8">EQUIPO 8</option>
    <option value="PARIS">PARIS</option>
    <option value="BERAZATEGUI">BERAZATEGUI</option>
    <option value="EQUIPO 23">EQUIPO 23</option>
    
    {/* Equipos de la segunda imagen */}
    <option value="MANCHESTER">MANCHESTER</option>
    <option value="INTER">INTER</option>
    <option value="EQUIPO VERDE">EQUIPO VERDE</option>
    <option value="EQUIPO HALCON">EQUIPO HALCON</option>
    <option value="EQUIPO ROSA">EQUIPO ROSA</option>
    
    {/* Equipos de la tercera imagen */}
    <option value="MONTEVERDE">MONTEVERDE</option>
    <option value="WILDE III">WILDE III</option>
    <option value="VARELA I">VARELA I</option>
    <option value="ESCALADA">ESCALADA</option>
    <option value="MONTE GRANDE">MONTE GRANDE</option>
    <option value="PINEYRO">PINEYRO</option>
    <option value="EQUIPO 16">EQUIPO 16</option>
    <option value="SARANDI II">SARANDI II</option>
    <option value="CLAHE">CLAHE</option>
    <option value="VARELA II">VARELA II</option>
    <option value="EQUIPO 6">EQUIPO 6</option>
    <option value="ONIX">ONIX</option>
    <option value="BERNAL">BERNAL</option>
    <option value="LOMAS DE ZAMORA">LOMAS DE ZAMORA</option>
    <option value="EQUIPO 22">EQUIPO 22</option>
  </select> 
</div>
            <div className="form-group full-width">
              <label>Observaciones</label>
              <textarea name="observacion" value={formData.observacion} onChange={handleChange} placeholder="Notas adicionales o especificaciones" rows={4} disabled={isLoading} />
            </div>

            {/* ********************************************************* */}
            {/* SECCIÓN DE FOTO: OBLIGATORIA Y CON ALTA VISIBILIDAD */}
            {/* ********************************************************* */}
            <div className="form-group full-width">
              {/* Etiqueta dinámica: cambia de color si falta la foto (con CSS) */}
              <label className={!formData.foto && !isLoading ? 'required-label-missing' : ''}>
                📸 Foto del Comprobante **OBLIGATORIA** *
              </label>
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
                <label 
                    htmlFor="photo-input" 
                    className={`photo-upload-label file-label-modified ${formData.foto ? 'uploaded' : ''}`}
                >
                  {formData.foto ? '✅ Foto adjunta (haz clic para cambiar)' : '📤 **ADJUNTAR FOTO DEL COMPROBANTE**'}
                </label>
              </div>
              
              {formData.foto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="btn-remove-photo"
                  disabled={isLoading}
                >
                  ❌ Eliminar Foto Adjunta
                </button>
              )}
            </div>
          </div>
        </div>
       {/* El mensaje de éxito/error se renderiza aquí y será muy visible con CSS */}
        {message && <div className={`form-message ${message.type}`}>{message.text}</div>}
        {/* -------------------- BOTONES -------------------- */}
        <div className="form-actions">
          {/* El botón de envío usa la animación de carga/color brillante si isLoading es true */}
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '🔄 ENVIANDO Y GUARDANDO...' : '¡Enviar!'}
          </button>
          <button type="button" className="btn-reset" onClick={() => { setFormData(initialFormData); setMessage(null); }} disabled={isLoading}>
            ↻ Limpiar Formulario
          </button>
        </div>
      </div>
    </form>
  );
}