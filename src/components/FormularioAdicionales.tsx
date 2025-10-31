// src/components/FormularioAdicionales.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./EventForm.css";

interface Adicional {
  descripcion: string;
}

interface FormData {
  // Datos del Evento
  salon: string;
  fechaEvento: string;
  tipoEvento: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: string;
  nombreHomenajeado: string;
  familiar: string;

  // Datos de Contacto
  tel1: string;
  nombreTel1: string;
  tel2: string;
  nombreTel2: string;
  direccion: string;
  cuil: string;
  correo: string;

  // Pago
  detallePago: string;
  importeAbonado: string;
  resto: string;
  fechaRestante: string;
  medioPago: string;

  // Otros
  regalo: "si" | "no";
  cualRegalo: string;
  observaciones: string;
  equipo: string;

  // Adicionales
  adicionales: Adicional[];

  // Foto
  fotoComprobante: File | null;
}

const initialFormData: FormData = {
  salon: "",
  fechaEvento: "",
  tipoEvento: "",
  horaInicio: "",
  horaFin: "",
  cantidadPersonas: "",
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
  fechaRestante: "",
  medioPago: "",
  regalo: "no",
  cualRegalo: "",
  observaciones: "",
  equipo: "",
  adicionales: [],
  fotoComprobante: null,
};

const adicionalesPredefinidos = [
  { nombre: "Mozo" },
  { nombre: "Cuidador de autos" },
  { nombre: "Barman", requiereDescripcion: true },
  { nombre: "Fotografía" },
  { nombre: "Book + libro de firmas" },
  { nombre: "Video cronológico" },
  { nombre: "Filmación" },
  { nombre: "Isla", requiereDescripcion: true },
  { nombre: "Vestido de 15" },
  { nombre: "Vestido de novia" },
  { nombre: "Maquillaje + peinado" },
  { nombre: "Saxofonista" },
  { nombre: "Transformista" },
  { nombre: "Robot led" },
  { nombre: "Pistola para robot" },
  { nombre: "Plataforma 360°" },
  { nombre: "Stand de glitter" },
  { nombre: "Stand de tatto" },
  { nombre: "2 osos gigantes" },
  { nombre: "Shimmer" },
  { nombre: "Arco de globos" },
  { nombre: "Letra luminosa" },
  { nombre: "Estructura ceremonial" },
  { nombre: "Alfombra roja" },
  { nombre: "Sillón princesa" },
  { nombre: "Lanza papelitos" },
  { nombre: "Cotillón premium" },
  { nombre: "Cotillón fluor" },
  { nombre: "15 rosas" },
  { nombre: "Lluvia de pétalos" },
  { nombre: "Chispas", requiereDescripcion: true },
  { nombre: "Pantalla" }
];

export default function FormularioCompleto() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar mensaje de error al cambiar cualquier campo
    if (message && message.type === 'error') setMessage(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, fotoComprobante: file }));
    // Limpiar mensaje de error si el usuario adjunta algo
    if (message && message.type === 'error' && message.text.includes('foto del comprobante')) setMessage(null);
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, fotoComprobante: null }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const PHOTO_ERROR_TEXT = "❌ ERROR: La foto del comprobante es OBLIGATORIA para guardar la reserva.";

    // **********************************************
    // 🛑 VALIDACIÓN DE FOTO OBLIGATORIA
    // **********************************************
    if (!formData.fotoComprobante) {
      setMessage({ type: "error", text: PHOTO_ERROR_TEXT });
      setIsLoading(false);
      return; 
    }
    // **********************************************

    try {
      const formBody = new FormData();
      formBody.append("tipoFormulario", "completo");

      // Campos básicos
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "fotoComprobante" && key !== "adicionales") {
          formBody.append(key, String(value));
        }
      });

      // Adicionales - solo enviar las descripciones limpias
      const adicionalesLimpios = formData.adicionales.map(a => a.descripcion);
      formBody.append("adicionales", JSON.stringify(adicionalesLimpios));

      // Foto en base64
      if (formData.fotoComprobante) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.fotoComprobante!);
        });
        const base64 = await base64Promise;
        formBody.append("fotoComprobante", base64);
      }

      // Enviar al Apps Script
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby4sFsydXJp-5NjiyC0U0KkYM5sV6_zUUMo0EB9U7r5yxH89DseBO8j_RKljMiozUn-/exec",
        { method: "POST", body: formBody }
      );

      const result = await response.json();
      if (result.status === "success") {
        setMessage({ type: "success", text: "✅ RESERVA GUARDADA Y REGISTRADA EXITOSAMENTE" });
        setFormData(initialFormData);
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: "error", text: `❌ Error al guardar: ${result.message}` });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error de conexión: ${error instanceof Error ? error.message : "Error de conexión"}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isPhotoError = message && message.type === 'error' && message.text.includes('foto del comprobante');

  return (
    <div className="modern-event-form">
      <div className="form-container">
        <div className="form-header">
          <h1>Formulario Completo del Evento</h1>
        </div>

        {/* 1. Ubicación: Arriba del contenido del formulario (Aviso general) */}
        {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          {/* Datos del Evento */}
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
                <label>Fecha *</label>
                <input type="date" name="fechaEvento" value={formData.fechaEvento} onChange={handleChange} disabled={isLoading} />
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
                <label>Hora Inicio</label>
                <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Hora Fin</label>
                <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Cantidad de Personas</label>
                <input type="number" name="cantidadPersonas" value={formData.cantidadPersonas} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Nombre Homenajeado</label>
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
                <label>Nombre Tel 1</label>
                <input type="text" name="nombreTel1" value={formData.nombreTel1} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Teléfono 2</label>
                <input type="tel" name="tel2" value={formData.tel2} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Nombre Tel 2</label>
                <input type="text" name="nombreTel2" value={formData.nombreTel2} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>CUIL</label>
                <input type="text" name="cuil" value={formData.cuil} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Correo</label>
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
                <label>Fecha Restante</label>
                <input type="date" name="fechaRestante" value={formData.fechaRestante} onChange={handleChange} disabled={isLoading} />
              </div>
              <div className="form-group">
                <label>Medio de Pago</label>
                <select name="medioPago" value={formData.medioPago} onChange={handleChange} disabled={isLoading}>
                  <option value="">-- Seleccione --</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Devito">Devito</option>
                <option value="Credito">Credito</option>
                <option value="QR">QR</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Mercado Pago">Otro</option>
                </select>
              </div>
            </div>
          </div>

         {/* Adicionales */}
<div className="form-section">
  <div className="section-header"><h2>Adicionales</h2></div>
  <div className="adicionales-grid">
    {adicionalesPredefinidos.map((s, i) => {
      const checked = formData.adicionales.some(a => a.descripcion.startsWith(s.nombre));
      const detalle = formData.adicionales.find(a => a.descripcion.startsWith(s.nombre))?.detalle || "";

      return (
        <div key={i} className="adicional-item">
          <label className="adicional-checkbox">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => {
                if (e.target.checked) {
                  setFormData(prev => ({
                    ...prev,
                    adicionales: [...prev.adicionales, { descripcion: s.nombre, detalle: "" }]
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    adicionales: prev.adicionales.filter(a => !a.descripcion.startsWith(s.nombre))
                  }));
                }
              }}
              disabled={isLoading}
            />
            {s.nombre}
          </label>

          {/* Si requiere descripción y está seleccionado */}
          {s.requiereDescripcion && checked && (
            <input
              type="text"
              placeholder="Especificar detalle..."
              value={detalle}
              onChange={e => {
                const nuevoDetalle = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  adicionales: prev.adicionales.map(a =>
                    a.descripcion.startsWith(s.nombre)
                      ? { ...a, detalle: nuevoDetalle, descripcion: `${s.nombre} (${nuevoDetalle})` }
                      : a
                  )
                }));
              }}
              className="adicional-input"
              disabled={isLoading}
            />
          )}
        </div>
      );
    })}
  </div>
</div>

          {/* Otros detalles */}
          <div className="form-section">
            <div className="section-header"><h2>Otros Detalles</h2></div>
            <div className="form-grid">
              <div className="form-group">
                <label>¿Regalo?</label>
                <select name="regalo" value={formData.regalo} onChange={handleChange} disabled={isLoading}>
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>
              {formData.regalo === "si" && (
                <div className="form-group">
                  <label>¿Cuál Regalo?</label>
                  <input type="text" name="cualRegalo" value={formData.cualRegalo} onChange={handleChange} disabled={isLoading} />
                </div>
              )}
              <div className="form-group full-width">
                <label>Observaciones</label>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} disabled={isLoading} />
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
            </div>
          </div>

          {/* Foto Comprobante */}
          <div className="form-section">
            <div className="section-header"><h2>Comprobante de Pago (OBLIGATORIO)</h2></div>
            <div className="form-group full-width">
              {/* Etiqueta dinámica: cambia de color si falta la foto (con CSS) */}
              <label className={!formData.fotoComprobante && !isLoading ? 'required-label-missing' : ''}>
                📸 Foto del Comprobante **OBLIGATORIA** *
              </label>
              
              <input 
                type="file" 
                name="fotoComprobante" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={isLoading} 
                style={{ display: 'none' }}
                id="photo-completo-input"
              />
              
              <label 
                  htmlFor="photo-completo-input" 
                  className={`photo-upload-label file-label-modified ${formData.fotoComprobante ? 'uploaded' : ''}`}
              >
                {formData.fotoComprobante ? '✅ Foto adjunta (haz clic para cambiar)' : '📤 **ADJUNTAR FOTO DEL COMPROBANTE**'}
              </label>

              {/* Botón para eliminar foto adjunta */}
              {formData.fotoComprobante && (
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
            {/* 🛑 Ubicación 2: INLINE (Debajo de la foto, solo error de foto) */}
            {isPhotoError && (
                 <div className="form-message-inline error">{message!.text}</div>
            )}
          </div>

          {/* 3. Ubicación: Arriba del botón de envío (Aviso general) */}
          {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

          {/* Botones */}
          <div className="form-actions">
            <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}>
              {isLoading ? "🔄 ENVIANDO Y GUARDANDO..." : "⭐ GUARDAR RESERVA (¡Enviar!)"}
            </button>
            <button 
                type="button" 
                className="btn-reset"
                onClick={() => { setFormData(initialFormData); setMessage(null); }} 
                disabled={isLoading}>
                🔄 Limpiar Formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}