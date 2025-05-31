import { client } from './db.js'; // tu cliente Turso ya configurado
import { faker } from '@faker-js/faker'; // para generar correos y fechas

// Listas para productos y tipos
const productos = ['proteina', 'creatina', 'aminoacidos', 'vitaminas', 'minerales', 'proteinaWey', 'BCAA', 'glutamina'];
const tipos = ['NOseque', 'ejemplo', 'Nosecuantos', 'tipoA', 'tipoB', 'tipoC', 'tipoX', 'tipoY'];

// Función para generar productos en el formato:
// "producto&%&tipoProducto<<<producto2&%&tipoProducto2"
function generarProductos() {
  const n = Math.floor(Math.random() * 3) + 1; // 1 a 3 productos
  const partes = [];
  for (let i = 0; i < n; i++) {
    const prod = productos[Math.floor(Math.random() * productos.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    partes.push(`${prod}&%&${tipo}`);
  }
  return partes.join('<<<');
}

// Función para generar fecha entre 01/01/2024 y 24/05/2025 en formato dd/mm/yyyy
function generarFecha() {
  const start = new Date(2024, 0, 1);
  const end = new Date(2025, 4, 24);
  const fecha = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const dd = String(fecha.getDate()).padStart(2, '0');
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const yyyy = fecha.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

async function generarYGuardarRegistros(cantidad = 100) {
  for (let i = 0; i < cantidad; i++) {
    const correoUsuarioCompra = faker.internet.email();
    const productosComprados = generarProductos();
    const fechaCompleta = generarFecha();
    const precioTotal = (Math.random() * (200 - 10) + 10).toFixed(2);

    // Aquí asumo que tienes una tabla 'compras' con esas columnas y que puedes hacer un insert así:
    const query = `
      INSERT INTO compras (correoUsuarioCompra, productosComprados, fechaCompleta, precioTotal)
      VALUES (?, ?, ?, ?)
    `;

    try {
      await client.execute(query, [correoUsuarioCompra, productosComprados, fechaCompleta, precioTotal]);
      console.log(`Insertado registro ${i + 1}`);
    } catch (err) {
      console.error('Error insertando registro:', err);
    }
  }
}

generarYGuardarRegistros();
