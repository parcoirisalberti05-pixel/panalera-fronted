// Textos y medidas que se muestran en la ventana de detalle del calzado.
// Todo esto se puede completar o corregir más adelante sin tocar nada más.

// Medidas del pie en cm, por etapa y talle. Mientras esté vacío, la tabla de
// medidas no se muestra. Ejemplo para cargar:
//   'No caminantes': { 13: '8,7', 14: '9,3' }
export const MEDIDAS: Record<string, Record<number, string>> = {
  'No caminantes': {},
  'Primeros pasos': {},
  'Kids': {}
};

// Texto general por etapa (se usa cuando el modelo no tiene descripción propia)
export const DESCRIPCION_ETAPA: Record<string, string> = {
  'No caminantes': 'Calzado Chapatitos para bebés que todavía no caminan.',
  'Primeros pasos': 'Calzado Chapatitos para acompañar los primeros pasos.',
  'Kids': 'Calzado Chapatitos para chicos.'
};

// Descripción propia de cada modelo-color. La clave es el "modelKey" (el mismo
// que usa calzado.ts). Si un modelo no figura acá, se usa el texto de la etapa.
// Ejemplo:
//   'guillermina-con-puntilla-becerro-blanco': 'Guillermina con botón. Ideal para bautismo.'
export const DESCRIPCIONES: Record<string, string> = {};

