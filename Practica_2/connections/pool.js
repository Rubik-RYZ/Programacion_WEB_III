const mysql = require('mysql2');
const { dbConfig, TABLE_NAME, NUM_RECORDS } = require('./config');
const { results } = require('./show_results');

async function testPoolConnection() {
  console.log('\nProbando conexión con pool...');
  const startTime = Date.now();
  
  // Crear pool
  const connectStart = Date.now();
  const pool = mysql.createPool({
    ...dbConfig,
    connectionLimit: 10
  });
  
  const promisePool = pool.promise();
  results.pool.connect = Date.now() - connectStart;
  console.log(`Conexión pool: ${results.pool.connect}ms`);
  
  try {
    // Limpiar tabla
    await promisePool.execute(`TRUNCATE TABLE ${TABLE_NAME}`);
    
    // Insertar registros
    const insertStart = Date.now();
    const conn = await promisePool.getConnection();
    await conn.beginTransaction();
    
    try {
      for (let i = 0; i < NUM_RECORDS; i++) {
        const nombre = `Usuario ${i}`;
        const email = `usuario${i}@ejemplo.com`;
        const edad = Math.floor(Math.random() * 50) + 18;
        
        await conn.execute(
          `INSERT INTO ${TABLE_NAME} (nombre, email, edad) VALUES (?, ?, ?)`,
          [nombre, email, edad]
        );
      }
      
      await conn.commit();
    } finally {
      conn.release();
    }
    
    results.pool.insert = Date.now() - insertStart;
    console.log(`Inserción pool: ${results.pool.insert}ms`);
    
    // Mostrar resultados con SELECT
    const [rows] = await promisePool.execute(`SELECT COUNT(*) as count FROM ${TABLE_NAME}`);
    console.log(`Registros insertados: ${rows[0].count}`);
    
    pool.end();
    
    results.pool.total = Date.now() - startTime;
    console.log(`Total pool: ${results.pool.total}ms`);
    
  } catch (err) {
    console.error('Error en pool:', err);
    throw err;
  }
}

module.exports = { testPoolConnection };
