const mysql = require('mysql2');
const { dbConfig, TABLE_NAME, NUM_RECORDS } = require('./config');
const { results } = require('./show_results');

async function testBasicConnection() {
  console.log('Probando conexión básica ...');
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    // conexion
    const connectStart = Date.now();
    const connection = mysql.createConnection(dbConfig);
    
    connection.connect((err) => {
      if (err) {
        console.error('Error conectando:', err);
        reject(err);
        return;
      }
      
      results.basic.connect = Date.now() - connectStart;
      console.log(`Conexión básica: ${results.basic.connect}ms`);
      
      // Limpiar tabla
      connection.query(`TRUNCATE TABLE ${TABLE_NAME}`, (err) => {
        if (err) {
          console.error('Error al truncar tabla:', err);
          connection.end();
          reject(err);
          return;
        }
        
        // Insertar registros
        const insertStart = Date.now();
        let inserted = 0;
        
        function insertRecord() {
          if (inserted >= NUM_RECORDS) {
            results.basic.insert = Date.now() - insertStart;
            console.log(`Inserción básica: ${results.basic.insert}ms`);
            
            // Mostrar total resultados con SELECT
            connection.query(`SELECT COUNT(*) as count FROM ${TABLE_NAME}`, (err, result) => {
              if (err) {
                connection.end();
                reject(err);
                return;
              }
              
              console.log(`Registros insertados: ${result[0].count}`);
              
              connection.end();
              results.basic.total = Date.now() - startTime;
              console.log(`Total básico: ${results.basic.total}ms`);
              resolve();
            });
            return;
          }
          
          const nombre = `Usuario ${inserted}`;
          const email = `usuario${inserted}@ejemplo.com`;
          const edad = Math.floor(Math.random() * 50) + 18;
          
          connection.query(
            `INSERT INTO ${TABLE_NAME} (nombre, email, edad) VALUES (?, ?, ?)`,
            [nombre, email, edad],
            (err) => {
              if (err) {
                console.error('Error insertando:', err);
                connection.end();
                reject(err);
                return;
              }
              
              inserted++;
              insertRecord();
            }
          );
        }
        
        // Iniciar inserciones
        insertRecord();
      });
    });
  });
}

module.exports = { testBasicConnection };
