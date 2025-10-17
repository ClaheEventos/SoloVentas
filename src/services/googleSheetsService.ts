/**
 * Servicio para conectar con Google Apps Script
 * Reemplaza 'YOUR_WEB_APP_URL' con la URL real de tu Web App publicada
 */

import { type IFormData } from '../interfaces/EventFormTypes';

/**
 * PASO IMPORTANTE: Reemplaza esta URL con la tuya
 * 
 * Cómo obtenerla:
 * 1. Abre tu Google Sheet "soloVentas"
 * 2. Ve a Extensiones → Apps Script
 * 3. Haz clic en "Implementar" → "Nueva implementación"
 * 4. Selecciona "Aplicación web"
 * 5. Copia la URL que aparece (algo como: https://script.google.com/macros/s/ABC123XYZ/usercopy)
 * 6. Pégala aquí abajo, reemplazando todo lo que está entre las comillas
 */
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUb2joQ5S1DMTXqX-J1TFEgzYHDq8QckkcsHzI_8c9cvFaVagjQNyaFmDtKWb8_O-g/exec';

interface GoogleResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

/**
 * Envía los datos del formulario a Google Sheets a través de Google Apps Script
 */
export async function saveReservationToGoogleSheets(formData: IFormData): Promise<GoogleResponse> {
  try {
    // Agregar timestamp de envío
    const dataToSend = {
      ...formData,
      fechaRegistro: new Date().toLocaleString('es-AR'),
    };

    // Realizar petición POST
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    // Validar respuesta
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Parsear respuesta JSON
    const result: GoogleResponse = await response.json();
    return result;

  } catch (error) {
    console.error('Error al guardar en Google Sheets:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Error desconocido al conectar con Google Sheets',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Valida que la URL esté configurada correctamente
 */
export function isGoogleSheetsConfigured(): boolean {
  return GOOGLE_APPS_SCRIPT_URL !== 'https://script.google.com/macros/s/AKfycbzUb2joQ5S1DMTXqX-J1TFEgzYHDq8QckkcsHzI_8c9cvFaVagjQNyaFmDtKWb8_O-g/exec';
}