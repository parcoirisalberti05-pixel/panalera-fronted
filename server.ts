import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const Pool = pg.Pool || (pg as any).default?.Pool || pg;

const app = express();
const PORT = 5000;

app.use(express.json());

// Configuration for PostgreSQL connection
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'postgres',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
});

pool.on('error', (err: any) => {
  console.error('Error inesperado en cliente inactivo de PostgreSQL:', err);
});

// Helper DB Query handler with standard error logs
const queryDatabase = async (text: string, params?: any[]) => {
  return await pool.query(text, params);
};

// Health Check Endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'conectado' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'desconectado', detalle: (err as Error).message });
  }
});

// 1. GET /productos - Lista todos los productos con marca, línea, talle, precio y stock actual
const getProductos = async (_req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.codigo_barras,
        p.precio,
        p.talle,
        p.activo,
        p.creado_en,
        p.actualizado_en,
        l.nombre AS linea,
        m.nombre AS marca,
        COALESCE(s.cantidad, 0) AS stock
      FROM productos p
      LEFT JOIN lineas l ON p.linea_id = l.id
      LEFT JOIN marcas m ON l.marca_id = m.id
      LEFT JOIN stock s ON p.id = s.producto_id
      ORDER BY p.id ASC;
    `;
    const result = await queryDatabase(sql);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({
      error: 'Error al consultar la base de datos de productos',
      detalle: (error as Error).message
    });
  }
};

// 2. GET /productos/:codigo_barras - Busca un producto por código de barras con su info completa y stock
const getProductoPorCodigoBarras = async (req: Request, res: Response) => {
  const { codigo_barras } = req.params;

  if (!codigo_barras) {
    return res.status(400).json({ error: 'Debe proporcionar un código de barras' });
  }

  try {
    const sql = `
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.codigo_barras,
        p.precio,
        p.talle,
        p.activo,
        p.creado_en,
        p.actualizado_en,
        l.nombre AS linea,
        m.nombre AS marca,
        COALESCE(s.cantidad, 0) AS stock
      FROM productos p
      LEFT JOIN lineas l ON p.linea_id = l.id
      LEFT JOIN marcas m ON l.marca_id = m.id
      LEFT JOIN stock s ON p.id = s.producto_id
      WHERE p.codigo_barras = $1;
    `;
    const result = await queryDatabase(sql, [codigo_barras]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al buscar producto por código de barras:', error);
    return res.status(500).json({
      error: 'Error al consultar el producto',
      detalle: (error as Error).message
    });
  }
};

// 3. POST /venta - Registra una venta, descuenta stock de forma atómica y guarda el movimiento
const registrarVenta = async (req: Request, res: Response) => {
  const { codigo_barras, cantidad, canal } = req.body;

  if (!codigo_barras) {
    return res.status(400).json({ error: 'El campo codigo_barras es requerido' });
  }

  const cantidadNum = parseInt(cantidad, 10);
  if (isNaN(cantidadNum) || cantidadNum <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número entero mayor a 0' });
  }

  const canalNormalizado = (canal === 'web' || canal === 'fisico') ? canal : 'fisico';

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Buscar producto y bloquear la fila con FOR UPDATE
    const queryProducto = `
      SELECT p.id, p.nombre, COALESCE(s.cantidad, 0) AS stock_actual
      FROM productos p
      LEFT JOIN stock s ON p.id = s.producto_id
      WHERE p.codigo_barras = $1
      FOR UPDATE
    `;
    const resultProd = await client.query(queryProducto, [codigo_barras]);

    if (resultProd.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Producto no encontrado con el código de barras proporcionado' });
    }

    const producto = resultProd.rows[0];
    const stockActual = parseInt(producto.stock_actual, 10);

    if (stockActual < cantidadNum) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Stock insuficiente',
        stock_actual: stockActual,
        cantidad_solicitada: cantidadNum
      });
    }

    const nuevoStock = stockActual - cantidadNum;

    // Actualizar o insertar registro en la tabla stock
    const queryUpdateStock = `
      INSERT INTO stock (producto_id, cantidad, actualizado_en)
      VALUES ($1, $2, NOW())
      ON CONFLICT (producto_id)
      DO UPDATE SET cantidad = $2, actualizado_en = NOW()
    `;
    await client.query(queryUpdateStock, [producto.id, nuevoStock]);

    // Registrar en movimientos_stock
    const queryMovimiento = `
      INSERT INTO movimientos_stock (producto_id, canal, tipo, cantidad, fecha, nota)
      VALUES ($1, $2, 'venta', $3, NOW(), $4)
    `;
    await client.query(queryMovimiento, [
      producto.id,
      canalNormalizado,
      cantidadNum,
      `Venta por canal ${canalNormalizado}`
    ]);

    await client.query('COMMIT');

    return res.json({
      mensaje: 'Venta registrada con éxito',
      producto_id: producto.id,
      nombre: producto.nombre,
      codigo_barras,
      cantidad_vendida: cantidadNum,
      stock_anterior: stockActual,
      nuevo_stock: nuevoStock,
      canal: canalNormalizado
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al procesar la venta:', error);
    return res.status(500).json({
      error: 'Error interno al procesar la venta',
      detalle: (error as Error).message
    });
  } finally {
    client.release();
  }
};

// 4. GET /stock-bajo - Lista productos con stock menor a 5 unidades
const getStockBajo = async (_req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.categoria,
        p.codigo_barras,
        p.precio,
        p.talle,
        p.activo,
        l.nombre AS linea,
        m.nombre AS marca,
        COALESCE(s.cantidad, 0) AS stock
      FROM productos p
      LEFT JOIN lineas l ON p.linea_id = l.id
      LEFT JOIN marcas m ON l.marca_id = m.id
      LEFT JOIN stock s ON p.id = s.producto_id
      WHERE COALESCE(s.cantidad, 0) < 5
      ORDER BY stock ASC, p.nombre ASC;
    `;
    const result = await queryDatabase(sql);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    return res.status(500).json({
      error: 'Error al consultar productos con stock bajo',
      detalle: (error as Error).message
    });
  }
};

// 5. POST /reposicion - Incremente stock de forma atómica y registra movimiento (reposicion, ajuste, devolucion)
const registrarReposicion = async (req: Request, res: Response) => {
  const { codigo_barras, cantidad, tipo, canal, nota } = req.body;

  if (!codigo_barras) {
    return res.status(400).json({ error: 'El campo codigo_barras es requerido' });
  }

  const cantidadNum = parseInt(cantidad, 10);
  if (isNaN(cantidadNum) || cantidadNum <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número entero mayor a 0' });
  }

  const tiposPermitidos = ['reposicion', 'ajuste', 'devolucion'];
  const tipoNormalizado = (tipo && tiposPermitidos.includes(tipo.toString().toLowerCase()))
    ? tipo.toString().toLowerCase()
    : 'reposicion';

  const canalNormalizado = (canal === 'web' || canal === 'fisico') ? canal : 'fisico';
  const notaFinal = nota || `Ingreso por ${tipoNormalizado}`;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Buscar producto y bloquear fila con FOR UPDATE
    const queryProducto = `
      SELECT p.id, p.nombre, COALESCE(s.cantidad, 0) AS stock_actual
      FROM productos p
      LEFT JOIN stock s ON p.id = s.producto_id
      WHERE p.codigo_barras = $1
      FOR UPDATE
    `;
    const resultProd = await client.query(queryProducto, [codigo_barras]);

    if (resultProd.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Producto no encontrado con el código de barras proporcionado' });
    }

    const producto = resultProd.rows[0];
    const stockActual = parseInt(producto.stock_actual, 10);
    const nuevoStock = stockActual + cantidadNum;

    // Actualizar o insertar registro en la tabla stock
    const queryUpdateStock = `
      INSERT INTO stock (producto_id, cantidad, actualizado_en)
      VALUES ($1, $2, NOW())
      ON CONFLICT (producto_id)
      DO UPDATE SET cantidad = $2, actualizado_en = NOW()
    `;
    await client.query(queryUpdateStock, [producto.id, nuevoStock]);

    // Registrar en movimientos_stock
    const queryMovimiento = `
      INSERT INTO movimientos_stock (producto_id, canal, tipo, cantidad, fecha, nota)
      VALUES ($1, $2, $3, $4, NOW(), $5)
      RETURNING id, fecha
    `;
    const resMovimiento = await client.query(queryMovimiento, [
      producto.id,
      canalNormalizado,
      tipoNormalizado,
      cantidadNum,
      notaFinal
    ]);

    await client.query('COMMIT');

    const movimiento = resMovimiento.rows[0];

    return res.json({
      mensaje: 'Reposición / movimiento de stock registrado con éxito',
      producto_id: producto.id,
      nombre: producto.nombre,
      codigo_barras,
      cantidad_ingresada: cantidadNum,
      stock_anterior: stockActual,
      nuevo_stock: nuevoStock,
      movimiento_registrado: {
        id: movimiento.id,
        tipo: tipoNormalizado,
        canal: canalNormalizado,
        cantidad: cantidadNum,
        nota: notaFinal,
        fecha: movimiento.fecha
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al procesar la reposición de stock:', error);
    return res.status(500).json({
      error: 'Error interno al procesar la reposición de stock',
      detalle: (error as Error).message
    });
  } finally {
    client.release();
  }
};

// Register endpoints for both direct paths and /api/ prefixed paths for flexibility
app.get('/productos', getProductos);
app.get('/api/productos', getProductos);

app.get('/productos/:codigo_barras', getProductoPorCodigoBarras);
app.get('/api/productos/:codigo_barras', getProductoPorCodigoBarras);

app.post('/venta', registrarVenta);
app.post('/api/venta', registrarVenta);

app.post('/reposicion', registrarReposicion);
app.post('/api/reposicion', registrarReposicion);

app.get('/stock-bajo', getStockBajo);
app.get('/api/stock-bajo', getStockBajo);

// Setup Vite Middleware for frontend rendering in development or static serving in production
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor Node.js Express escuchando en http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();
