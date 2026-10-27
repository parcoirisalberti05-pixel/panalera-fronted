import { Product } from '../types';

// @ts-expect-error - image asset
import img01 from '../assets/images/Chapatitos/Zapatilla_con_Suelin_Chapatitos_Lino_Azulino.webp';
// @ts-expect-error - image asset
import img02 from '../assets/images/Chapatitos/Pancha_con_Suelin_Chapatitos_Tusor_Gris.webp';
// @ts-expect-error - image asset
import img03 from '../assets/images/Chapatitos/Pancha_con_Suelin_Chapatitos_Blanco_con_Pintas.webp';
// @ts-expect-error - image asset
import img04 from '../assets/images/Chapatitos/Sandalia_Franciscana_Chapatitos_Beige_Tokio.webp';
// @ts-expect-error - image asset
import img05 from '../assets/images/Chapatitos/Prusiano_Liso_Chapatitos_Blanco.webp';
// @ts-expect-error - image asset
import img06 from '../assets/images/Chapatitos/Guillermina_Tira_al_Chapatitos_Nappa_Blanca.webp';
// @ts-expect-error - image asset
import img07 from '../assets/images/Chapatitos/Guillermina_con_Puntilla_Chapatitos_Becerro_Blanco.webp';
// @ts-expect-error - image asset
import img08 from '../assets/images/Chapatitos/Prusiano_Liso_Chapatitos_Arno_Beige.webp';
// @ts-expect-error - image asset
import img09 from '../assets/images/Chapatitos/Bota_Texana_con_Fleco_Chapatitos_Microfibra_Natural.webp';
// @ts-expect-error - image asset
import img10 from '../assets/images/Chapatitos/Botita_Gamuza_Chapatitos_Microfibra_Rosa.webp';
// @ts-expect-error - image asset
import img11 from '../assets/images/Chapatitos/Botita_Cuello_Volcado_Chapatitos_Praga_Suela.webp';
// @ts-expect-error - image asset
import img12 from '../assets/images/Chapatitos/Bota_Australiana_Chapatitos_Arno_Miel.webp';
// @ts-expect-error - image asset
import img13 from '../assets/images/Chapatitos/Little_Chap_Tejida_Chapatitos_Tejido_Gris_Perla.webp';
// @ts-expect-error - image asset
import img14 from '../assets/images/Chapatitos/Little_Chap_Tejida_Chapatitos_Tejido_Perlado.webp';
// @ts-expect-error - image asset
import img15 from '../assets/images/Chapatitos/Sandalia_Sport_con_Abrojo_Chapatitos_Praga_Suela.webp';
// @ts-expect-error - image asset
import img16 from '../assets/images/Chapatitos/Little_Chap_Chapatitos_Neopren_Celeste.webp';
// @ts-expect-error - image asset
import img17 from '../assets/images/Chapatitos/Little_chap_Vainilla.webp';
// @ts-expect-error - image asset
import img18 from '../assets/images/Chapatitos/Zapatilla_con_suelin_tusorRosa.webp';
// @ts-expect-error - image asset
import img19 from '../assets/images/Chapatitos/Bota_con_cuello_gris.webp';
// @ts-expect-error - image asset
import img20 from '../assets/images/Chapatitos/Zapatill_con_abrojo_LonaBeige.webp';
// @ts-expect-error - image asset
import img21 from '../assets/images/Chapatitos/Zapatill_con_abrojo_LonaRosa.webp';
// @ts-expect-error - image asset
import img22 from '../assets/images/Chapatitos/Nino_Natural.webp';
// @ts-expect-error - image asset
import img23 from '../assets/images/Chapatitos/Bota_con_Cuello_Chapatitos_Azul_Lona.webp';
// @ts-expect-error - image asset
import img24 from '../assets/images/Chapatitos/Chilli_Chapatitos_Arno_Chocolate.webp';
// @ts-expect-error - image asset
import img25 from '../assets/images/Chapatitos/Bota_con_Elastico_Chapatitos_Sint_Croco_Rosa.webp';
// @ts-expect-error - image asset
import img26 from '../assets/images/Chapatitos/Bota_Chavo_con_Cordon_Chapatitos_Texa_Beige.webp';
// @ts-expect-error - image asset
import img27 from '../assets/images/Chapatitos/Bota_con_Velcro_con_Suelin_Chapatitos_Arno_Chocolate.webp';

interface ModeloCalzado {
  key: string;
  modelo: string;
  color: string;
  art: string;
  image: string;
  subCategory: 'No caminantes' | 'Primeros pasos' | 'Kids';
  // [talle, precio, stock de respaldo]
  talles: [number, number, number][];
}

const MODELOS: ModeloCalzado[] = [
  { key: 'zapatilla-con-suelin-lino-azulino', modelo: 'Zapatilla con Suelin', color: 'Lino Azulino', art: 'C142', image: img01, subCategory: 'Primeros pasos', talles: [[14, 25000, 1], [15, 25000, 1], [16, 25000, 0], [17, 25000, 0]] },
  { key: 'pancha-con-suelin-tusor-gris', modelo: 'Pancha con Suelin', color: 'Tusor Gris', art: 'C144', image: img02, subCategory: 'Primeros pasos', talles: [[14, 25000, 1], [15, 25000, 1], [16, 25000, 1], [17, 25000, 1]] },
  { key: 'pancha-con-suelin-blanco-con-pintas', modelo: 'Pancha con Suelin', color: 'Blanco con Pintas', art: 'C144', image: img03, subCategory: 'Primeros pasos', talles: [[14, 25000, 1], [15, 25000, 1], [16, 25000, 1], [17, 25000, 1]] },
  { key: 'sandalia-franciscana-beige-tokio', modelo: 'Sandalia Franciscana', color: 'Beige Tokio', art: 'C504', image: img04, subCategory: 'No caminantes', talles: [[14, 25000, 1], [15, 25000, 1], [16, 25000, 1], [17, 25000, 1]] },
  { key: 'prusiano-liso-blanco', modelo: 'Prusiano Liso', color: 'Blanco', art: 'C1204', image: img05, subCategory: 'No caminantes', talles: [[14, 19000, 1], [15, 19000, 0], [16, 19000, 1], [17, 19000, 2]] },
  { key: 'guillermina-tira-al-nappa-blanca', modelo: 'Guillermina Tira al', color: 'Nappa Blanca', art: 'C1207', image: img06, subCategory: 'No caminantes', talles: [[13, 19000, 1], [14, 19000, 0], [15, 19000, 1], [16, 19000, 1], [17, 19000, 0]] },
  { key: 'guillermina-con-puntilla-becerro-blanco', modelo: 'Guillermina con Puntilla', color: 'Becerro Blanco', art: 'C1211', image: img07, subCategory: 'No caminantes', talles: [[13, 19000, 0], [14, 19000, 0], [15, 19000, 0], [16, 19000, 1], [17, 19000, 0]] },
  { key: 'prusiano-liso-arno-beige', modelo: 'Prusiano Liso', color: 'Arno Beige', art: 'C1204', image: img08, subCategory: 'No caminantes', talles: [[13, 19000, 0], [14, 19000, 0], [15, 19000, 1], [16, 19000, 1], [17, 19000, 0]] },
  { key: 'bota-texana-con-fleco-microfibra-natural', modelo: 'Bota Texana con Fleco', color: 'Microfibra Natural', art: 'C695', image: img09, subCategory: 'No caminantes', talles: [[13, 19000, 0], [14, 19000, 1], [15, 19000, 1], [16, 19000, 0], [17, 19000, 0]] },
  { key: 'botita-gamuza-microfibra-rosa', modelo: 'Botita Gamuza', color: 'Microfibra Rosa', art: 'C2100', image: img10, subCategory: 'No caminantes', talles: [[13, 19000, 1], [14, 19000, 0], [15, 19000, 0], [16, 19000, 0], [17, 19000, 1]] },
  { key: 'botita-cuello-volcado-praga-suela', modelo: 'Botita Cuello Volcado', color: 'Praga Suela', art: 'C1052', image: img11, subCategory: 'No caminantes', talles: [[13, 19000, 1], [14, 19000, 1], [15, 19000, 1], [16, 19000, 0], [17, 19000, 0]] },
  { key: 'bota-australiana-arno-miel', modelo: 'Bota Australiana', color: 'Arno Miel', art: 'C190', image: img12, subCategory: 'No caminantes', talles: [[13, 19000, 1], [14, 19000, 1], [15, 19000, 1], [16, 19000, 0], [17, 19000, 0]] },
  { key: 'little-chap-tejida-tejido-gris-perla', modelo: 'Little Chap Tejida', color: 'Tejido Gris Perla', art: 'C1313', image: img13, subCategory: 'Primeros pasos', talles: [[17, 35000, 1], [18, 35000, 0], [19, 35000, 0], [20, 35000, 1], [21, 35000, 0], [22, 35000, 1]] },
  { key: 'little-chap-tejida-tejido-perlado', modelo: 'Little Chap Tejida', color: 'Tejido Perlado', art: 'C1313', image: img14, subCategory: 'Primeros pasos', talles: [[17, 35000, 0], [18, 35000, 0], [19, 35000, 0], [20, 35000, 1], [21, 35000, 1], [22, 35000, 1]] },
  { key: 'sandalia-sport-con-abrojo-praga-suela', modelo: 'Sandalia Sport con Abrojo', color: 'Praga Suela', art: 'C11258c', image: img15, subCategory: 'Kids', talles: [[18, 43000, 1], [19, 43000, 1], [20, 43000, 1], [21, 43000, 1], [22, 43000, 1], [23, 43000, 1], [24, 43000, 1], [25, 43000, 1]] },
  { key: 'little-chap-neopren-celeste', modelo: 'Little Chap', color: 'Neopren Celeste', art: 'C1307', image: img16, subCategory: 'Primeros pasos', talles: [[17, 35000, 0], [18, 35000, 0], [19, 35000, 1], [20, 35000, 0], [21, 35000, 0], [22, 35000, 1], [23, 35000, 0], [24, 35000, 0], [25, 35000, 0], [26, 35000, 0]] },
  { key: 'little-chap-neopren-vainilla', modelo: 'Little Chap', color: 'Neopren Vainilla', art: 'C1307', image: img17, subCategory: 'Primeros pasos', talles: [[17, 35000, 1], [18, 35000, 1], [19, 35000, 1], [20, 35000, 1], [21, 35000, 1], [22, 35000, 0]] },
  { key: 'zapatilla-con-suelin-tusor-rosa', modelo: 'Zapatilla con Suelin', color: 'Tusor Rosa', art: 'C142', image: img18, subCategory: 'Primeros pasos', talles: [[14, 25000, 1], [15, 25000, 1], [16, 25000, 1], [17, 25000, 1]] },
  { key: 'bota-con-cuello-gris-lona', modelo: 'Bota con Cuello', color: 'Gris Lona', art: 'C9802', image: img19, subCategory: 'Kids', talles: [[17, 38000, 1], [18, 38000, 1], [19, 38000, 0], [20, 38000, 1], [21, 38000, 0], [22, 38000, 0], [23, 38000, 1], [24, 38000, 0], [25, 38000, 0], [26, 38000, 0]] },
  { key: 'zapatilla-con-abrojo-beige-lona', modelo: 'Zapatilla con Abrojo', color: 'Beige Lona', art: 'C9804', image: img20, subCategory: 'Kids', talles: [[17, 37000, 1], [18, 37000, 1], [19, 37000, 0], [20, 37000, 1], [21, 37000, 1], [22, 37000, 0], [23, 37000, 1], [24, 37000, 0], [25, 37000, 0], [26, 37000, 1]] },
  { key: 'zapatilla-con-abrojo-lona-rosa-glitter', modelo: 'Zapatilla con Abrojo', color: 'Lona Rosa Glitter', art: 'C9804', image: img21, subCategory: 'Kids', talles: [[17, 37000, 1], [18, 37000, 1], [19, 37000, 1], [20, 37000, 1], [21, 37000, 1], [22, 37000, 1], [23, 37000, 1]] },
  { key: 'nino-picado-natural', modelo: 'Nino', color: 'Picado Natural', art: 'C8027', image: img22, subCategory: 'Kids', talles: [[17, 42000, 0], [18, 42000, 1], [19, 42000, 1], [20, 42000, 0], [21, 42000, 1], [22, 42000, 0], [23, 42000, 0], [24, 42000, 1], [25, 42000, 1], [26, 42000, 1]] },
  { key: 'bota-con-cuello-azul-lona', modelo: 'Bota con Cuello', color: 'Azul Lona', art: 'C9802', image: img23, subCategory: 'Kids', talles: [[17, 38000, 1], [18, 38000, 1], [19, 38000, 0], [20, 38000, 0], [21, 38000, 0], [22, 38000, 1], [23, 38000, 1], [24, 38000, 0], [25, 38000, 0], [26, 38000, 0]] },
  { key: 'chilli-arno-chocolate', modelo: 'Chilli', color: 'Arno Chocolate', art: 'C27002', image: img24, subCategory: 'Kids', talles: [[17, 42000, 0], [18, 42000, 0], [19, 42000, 0], [20, 42000, 1], [21, 42000, 1], [22, 42000, 1], [23, 42000, 1], [24, 42000, 1], [25, 42000, 1], [26, 42000, 0]] },
  { key: 'bota-con-elastico-sint-croco-rosa', modelo: 'Bota con Elastico', color: 'Sint Croco Rosa', art: 'C24000', image: img25, subCategory: 'Kids', talles: [[17, 42000, 0], [18, 42000, 0], [19, 42000, 0], [20, 42000, 1], [21, 42000, 1], [22, 42000, 0], [23, 42000, 1], [24, 42000, 0], [25, 42000, 1], [26, 42000, 1]] },
  { key: 'bota-chavo-con-cordon-texa-beige', modelo: 'Bota Chavo con Cordon', color: 'Texa Beige', art: 'C25000', image: img26, subCategory: 'Kids', talles: [[17, 42000, 0], [18, 42000, 0], [19, 42000, 0], [20, 42000, 1], [21, 42000, 1], [22, 42000, 0], [23, 42000, 0], [24, 42000, 0], [25, 42000, 1], [26, 42000, 0]] },
  { key: 'bota-con-velcro-con-suelin-arno-chocolate', modelo: 'Bota con Velcro con Suelin', color: 'Arno Chocolate', art: 'C9802', image: img27, subCategory: 'Primeros pasos', talles: [[17, 25000, 1], [18, 25000, 1], [19, 25000, 0], [20, 25000, 0], [21, 25000, 1], [22, 25000, 0], [23, 25000, 0], [24, 25000, 0], [25, 25000, 0], [26, 25000, 0]] },
];

// Una entrada de Product por cada talle (cada talle tiene su propio stock en la base).
// El nombre tiene que coincidir con el de la base de datos.
export const CALZADO: Product[] = MODELOS.flatMap((m) =>
  m.talles.map(([talle, price, stock]) => ({
    id: `cal-${m.key}-t${talle}`,
    name: `${m.modelo} Chapatitos ${m.color} art.${m.art} Talle ${talle}`,
    description: `Calzado infantil Chapatitos, modelo ${m.modelo} en color ${m.color}.`,
    price,
    category: 'calzado' as const,
    subCategory: m.subCategory,
    image: m.image,
    rating: 0,
    reviews: 0,
    stock,
    featured: false,
    brand: 'Chapatitos' as const,
    modelKey: m.key,
    size: talle
  }))
);
