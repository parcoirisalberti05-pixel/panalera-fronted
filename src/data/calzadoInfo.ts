// Textos y medidas que se muestran en la ventana de detalle del calzado.
// Se pueden completar o corregir sin tocar nada más.

// Medidas del pie en cm. Hay dos tablas (la medida de un mismo talle cambia
// según el modelo, por eso se asigna por modelo y no por etapa).
export const TABLAS_MEDIDAS: Record<string, Record<number, string>> = {
  A: { 13: '8,7', 14: '9,3', 15: '10', 16: '10,6', 17: '11,3' },
  B: {
    17: '11,3', 18: '12', 19: '12,7', 20: '13,3', 21: '14',
    22: '14,7', 23: '15,3', 24: '16', 25: '16,6', 26: '17,3'
  }
};

// Qué tabla usa cada modelo (el número del final es el número de modelo)
export const TABLA_POR_MODELO: Record<string, string> = {
  'zapatilla-con-suelin-lino-azulino': 'A',  // 1
  'pancha-con-suelin-tusor-gris': 'A',  // 2
  'pancha-con-suelin-blanco-con-pintas': 'A',  // 3
  'sandalia-franciscana-beige-tokio': 'A',  // 4
  'prusiano-liso-blanco': 'A',  // 5
  'guillermina-tira-al-nappa-blanca': 'A',  // 6
  'guillermina-con-puntilla-becerro-blanco': 'A',  // 7
  'prusiano-liso-arno-beige': 'A',  // 8
  'bota-texana-con-fleco-microfibra-natural': 'A',  // 9
  'botita-gamuza-microfibra-rosa': 'A',  // 10
  'botita-cuello-volcado-praga-suela': 'A',  // 11
  'bota-australiana-arno-miel': 'A',  // 12
  'zapatilla-con-suelin-tusor-rosa': 'A',  // 18
  'little-chap-tejida-tejido-gris-perla': 'B',  // 13
  'little-chap-tejida-tejido-perlado': 'B',  // 14
  'sandalia-sport-con-abrojo-praga-suela': 'B',  // 15
  'little-chap-neopren-celeste': 'B',  // 16
  'little-chap-neopren-vainilla': 'B',  // 17
  'bota-con-cuello-gris-lona': 'B',  // 19
  'zapatilla-con-abrojo-beige-lona': 'B',  // 20
  'zapatilla-con-abrojo-lona-rosa-glitter': 'B',  // 21
  'nino-picado-natural': 'B',  // 22
  'bota-con-cuello-azul-lona': 'B',  // 23
  'chilli-arno-chocolate': 'B',  // 24
  'bota-con-elastico-sint-croco-rosa': 'B',  // 25
  'bota-chavo-con-cordon-texa-beige': 'B',  // 26
  'bota-con-velcro-con-suelin-arno-chocolate': 'B',  // 27
};

// Texto general por etapa (se usa cuando el modelo no tiene descripción propia)
export const DESCRIPCION_ETAPA: Record<string, string> = {
  'No caminantes': 'Calzado Chapatitos para bebés que todavía no caminan.',
  'Primeros pasos': 'Calzado Chapatitos para acompañar los primeros pasos.',
  'Kids': 'Calzado Chapatitos para chicos.'
};

// Descripción propia de cada modelo-color (clave = modelKey).
// Ejemplo: 'guillermina-con-puntilla-becerro-blanco': 'Texto de la descripción.'
export const DESCRIPCIONES: Record<string, string> = {};
