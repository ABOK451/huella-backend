import sequelize from '../config/db.js';
import Reto from '../models/reto.js';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // <- ruta desde seeders a la raíz

console.log('DB_USER:', process.env.DB_USER); // ahora debería mostrar "root"
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);


const retos = [
  // AGUA
  {
    titulo: 'Ducha de 5 minutos',
    descripcion: 'Reduce tu tiempo de ducha a 5 minutos o menos',
    categoria: 'agua',
    dificultad: 'facil',
    puntos: 15,
    impacto_co2: 0.5,
    impacto_agua: 50,
    instrucciones: 'Pon un temporizador antes de ducharte. Una ducha de 5 minutos ahorra hasta 50 litros de agua comparado con una de 10 minutos.',
    activo: true
  },
  {
    titulo: 'Cierra el grifo al cepillarte',
    descripcion: 'Mantén el grifo cerrado mientras te cepillas los dientes',
    categoria: 'agua',
    dificultad: 'facil',
    puntos: 10,
    impacto_co2: 0.3,
    impacto_agua: 12,
    instrucciones: 'Abre el agua solo para enjuagar el cepillo y tu boca. Este simple hábito puede ahorrar hasta 12 litros por cepillado.',
    activo: true
  },
  {
    titulo: 'Lava frutas en un recipiente',
    descripcion: 'Usa un recipiente con agua en lugar del grifo abierto',
    categoria: 'agua',
    dificultad: 'facil',
    puntos: 10,
    impacto_co2: 0.2,
    impacto_agua: 15,
    instrucciones: 'Llena un recipiente con agua para lavar frutas y verduras. El agua sobrante puedes usarla para regar plantas.',
    activo: true
  },
  {
    titulo: 'Recoge agua de lluvia',
    descripcion: 'Instala un sistema simple para recolectar agua de lluvia',
    categoria: 'agua',
    dificultad: 'medio',
    puntos: 25,
    impacto_co2: 1.2,
    impacto_agua: 100,
    instrucciones: 'Coloca cubetas o un barril bajo las bajadas de agua de tu techo. Usa esta agua para regar plantas o limpiar exteriores.',
    activo: true
  },
  
  // ENERGÍA
  {
    titulo: 'Desconecta aparatos en standby',
    descripcion: 'Desconecta todos los aparatos que no uses',
    categoria: 'energia',
    dificultad: 'facil',
    puntos: 15,
    impacto_co2: 0.8,
    impacto_agua: 0,
    instrucciones: 'Los aparatos en modo standby consumen energía fantasma. Desconéctalos o usa regletas con interruptor.',
    activo: true
  },
  {
    titulo: 'Cambia a focos LED',
    descripcion: 'Reemplaza al menos un foco incandescente por LED',
    categoria: 'energia',
    dificultad: 'medio',
    puntos: 20,
    impacto_co2: 1.5,
    impacto_agua: 0,
    instrucciones: 'Los focos LED consumen hasta 80% menos energía y duran hasta 25 veces más que los incandescentes.',
    activo: true
  },
  {
    titulo: 'Aprovecha la luz natural',
    descripcion: 'Mantén cortinas abiertas durante el día',
    categoria: 'energia',
    dificultad: 'facil',
    puntos: 10,
    impacto_co2: 0.5,
    impacto_agua: 0,
    instrucciones: 'Abre cortinas y persianas para aprovechar la luz solar. Reduce el uso de luz artificial durante el día.',
    activo: true
  },
  
  // TRANSPORTE
  {
    titulo: 'Usa bicicleta hoy',
    descripcion: 'Realiza al menos un trayecto en bicicleta',
    categoria: 'transporte',
    dificultad: 'medio',
    puntos: 25,
    impacto_co2: 3.5,
    impacto_agua: 0,
    instrucciones: 'La bicicleta no produce emisiones y es excelente ejercicio. Un trayecto de 5km en bici ahorra aproximadamente 1kg de CO2.',
    activo: true
  },
  {
    titulo: 'Camina distancias cortas',
    descripcion: 'Camina en lugar de usar vehículo para distancias menores a 1km',
    categoria: 'transporte',
    dificultad: 'facil',
    puntos: 15,
    impacto_co2: 0.8,
    impacto_agua: 0,
    instrucciones: 'Caminar es saludable y ecológico. Para distancias cortas, caminar puede ser incluso más rápido que buscar estacionamiento.',
    activo: true
  },
  {
    titulo: 'Usa transporte público',
    descripcion: 'Elige transporte público en lugar de auto particular',
    categoria: 'transporte',
    dificultad: 'facil',
    puntos: 20,
    impacto_co2: 2.5,
    impacto_agua: 0,
    instrucciones: 'El transporte público mueve a más personas usando menos combustible por persona que los autos particulares.',
    activo: true
  },
  
  // RESIDUOS
  {
    titulo: 'Día sin generar plástico',
    descripcion: 'Evita usar productos de plástico de un solo uso',
    categoria: 'residuos',
    dificultad: 'medio',
    puntos: 25,
    impacto_co2: 1.5,
    impacto_agua: 0,
    instrucciones: 'Lleva tus propias bolsas, botellas y contenedores reutilizables. Di no a popotes, cubiertos y envases desechables.',
    activo: true
  },
  {
    titulo: 'Separa tu basura',
    descripcion: 'Clasifica correctamente: orgánico, reciclable e inorgánico',
    categoria: 'residuos',
    dificultad: 'facil',
    puntos: 15,
    impacto_co2: 0.8,
    impacto_agua: 0,
    instrucciones: 'La separación correcta facilita el reciclaje y compostaje. Lava y seca los reciclables antes de desecharlos.',
    activo: true
  },
  {
    titulo: 'Lleva tu propia bolsa',
    descripcion: 'Usa bolsas reutilizables para todas tus compras',
    categoria: 'residuos',
    dificultad: 'facil',
    puntos: 10,
    impacto_co2: 0.5,
    impacto_agua: 0,
    instrucciones: 'Mantén bolsas reutilizables en tu auto o mochila. Una bolsa de tela puede reemplazar hasta 500 bolsas de plástico.',
    activo: true
  },
  
  // CONSUMO
  {
    titulo: 'Compra productos locales',
    descripcion: 'Adquiere al menos un producto de productores locales',
    categoria: 'consumo',
    dificultad: 'medio',
    puntos: 20,
    impacto_co2: 1.8,
    impacto_agua: 0,
    instrucciones: 'Los productos locales requieren menos transporte, son más frescos y apoyan la economía local.',
    activo: true
  },
  {
    titulo: 'Come sin carne hoy',
    descripcion: 'Elige opciones vegetarianas en todas tus comidas',
    categoria: 'consumo',
    dificultad: 'medio',
    puntos: 25,
    impacto_co2: 3.0,
    impacto_agua: 0,
    instrucciones: 'La producción de carne genera muchas emisiones. Un día sin carne ahorra aproximadamente 3kg de CO2.',
    activo: true
  },
  {
    titulo: 'Evita el desperdicio de comida',
    descripcion: 'Planifica tus comidas y aprovecha todo lo que compres',
    categoria: 'consumo',
    dificultad: 'facil',
    puntos: 15,
    impacto_co2: 1.2,
    impacto_agua: 0,
    instrucciones: 'El desperdicio de alimentos genera metano en vertederos. Planifica menús y guarda correctamente los alimentos.',
    activo: true
  }
];

const seedRetos = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');

    await Reto.bulkCreate(retos);
    console.log(`✅ ${retos.length} retos insertados correctamente`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar retos:', error);
    process.exit(1);
  }
};

seedRetos();
