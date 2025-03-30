const fs = require('node:fs');

// resultados del rendimiento
const results = {
    basic: { connect: 0, insert: 0, total: 0 },
    promise: { connect: 0, insert: 0, total: 0 },
    pool: { connect: 0, insert: 0, total: 0 }
  };

// generar informe de resultados
function generateReport() {
    // json
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    // md
    let report = `# Comparación de Métodos de Conexión MySQL en Node.js\n\n`;
    report += `## Resultados de las pruebas\n\n`;
    report += `| Método | Tiempo Conexión (ms) | Tiempo Inserción (ms) | Tiempo Total (ms) |\n`;
    report += `|--------|----------------------|------------------------|-------------------|\n`;
    report += `| Básico | ${results.basic.connect} | ${results.basic.insert} | ${results.basic.total} |\n`;
    report += `| Promesas | ${results.promise.connect} | ${results.promise.insert} | ${results.promise.total} |\n`;
    report += `| Pool | ${results.pool.connect} | ${results.pool.insert} | ${results.pool.total} |\n\n`;
    
    // conclusiones ordenadas por rendimiento
    const totals = [
      { method: 'Conexión Básica', time: results.basic.total },
      { method: 'Conexión Promesas', time: results.promise.total },
      { method: 'Conexión Pool', time: results.pool.total }
    ];
    totals.sort((a, b) => a.time - b.time);
    
    report += `## Conclusiones\n\n`;
    report += `El método más rápido es: **${totals[0].method}** con ${totals[0].time}ms\n\n`;
    report += `### Ventajas de cada método\n\n`;
    report += `- **Conexión Básica**: Simple de implementar, ideal para scripts pequeños.\n`;
    report += `- **Conexión Promesas**: Código más limpio y manejable, evita "callback hell".\n`;
    report += `- **Conexión Pool**: Ideal para aplicaciones web, reutiliza conexiones.\n\n`;
    
    fs.writeFileSync('README.md', report);
    console.log('\nInforme generado en README.md');
  }

module.exports = {
    results,
    generateReport
};