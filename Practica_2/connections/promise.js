const mysql2Promise = require('mysql2/promise');
const { dbConfig, TABLE_NAME, NUM_RECORDS } = require('./config');
const { results } = require('./show_results');

async function testPromiseConnection() {
  console.log('\nProbando conexión con promesas...');
  const startTime = Date.now();
  
  try {
    // Medir tiempo de conexión
    const connectStart = Date.now();
    const connection = await mysql2Promise.createConnection(dbConfig);
    results.promise.connect = Date.now() - connectStart;
    console.log(`Conexión promesas: ${results.promise.connect}ms`);
    
    // Limpiar tabla
    await connection.execute(`TRUNCATE TABLE ${TABLE_NAME}`);
    
    // Insertar registros
    const insertStart = Date.now();
    await connection.beginTransaction();
    
    for (let i = 0; i < NUM_RECORDS; i++) {
      const nombre = `Usuario ${i}`;
      const email = `usuario${i}@ejemplo.com`;
      const edad = Math.floor(Math.random() * 50) + 18;
      
      await connection.execute(
        `INSERT INTO ${TABLE_NAME} (nombre, email, edad) VALUES (?, ?, ?)`,
        [nombre, email, edad]
      );
    }
    
    await connection.commit();
    results.promise.insert = Date.now() - insertStart;
    console.log(`Inserción promesas: ${results.promise.insert}ms`);
    
    // Mostrar resultados con SELECT
    const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${TABLE_NAME}`);
    console.log(`Registros insertados: ${rows[0].count}`);
    
    await connection.end();
    
    results.promise.total = Date.now() - startTime;
    console.log(`Total promesas: ${results.promise.total}ms`);
    
  } catch (err) {
    console.error('Error en promesas:', err);
    throw err;
  }
}


module.exports = { testPromiseConnection };
