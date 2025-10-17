// src/interfaces/EventFormTypes.ts (o simplemente al inicio de EventForm.tsx)

export interface IFormData {
  salon: string;
  fechaEvento: string;
  tipoEvento: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: number | string; // Permitimos string para el input
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
  importeAbono: number | string;
  medioPago: string;
  resto: number | string;
  fechaLimite: string;
  regalo: 'si' | 'no'; // Tipos de unión para opciones limitadas
  cualRegalo: string;
  proximaEntrevista: string;
  observacion: string;
  equipo: string;
}

// Interfaz para las props del componente
export interface IEventFormProps {
  onSubmit: (formData: IFormData) => void;
}