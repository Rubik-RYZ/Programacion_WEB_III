const { testBasicConnection } = require("./connections/basic");
const { testPoolConnection } = require("./connections/pool");
const { testPromiseConnection } = require("./connections/promise");
const { generateReport} = require("./connections/show_results");

async function runAllTests() {
  try {
    // Iniciando pruebas...
    console.log('Iniciando pruebas de rendimiento de conexiones MySQL...');
    
    await testBasicConnection();
    await testPromiseConnection();
    await testPoolConnection();
    
    // Generar informe
    generateReport();
  } catch (err) {
    console.error('Error ejecutando pruebas:', err);
  }
}
runAllTests();