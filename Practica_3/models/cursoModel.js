const db = require('../config/database');

class Curso {
  static getAll(callback) {
    db.query('SELECT * FROM cursos', callback);
  }

  static getById(id, callback) {
    db.query('SELECT * FROM cursos WHERE id = ?', [id], callback);
  }

  static create(cursoData, callback) {
    db.query('INSERT INTO cursos SET ?', cursoData, callback);
  }

  static update(id, cursoData, callback) {
    db.query('UPDATE cursos SET ? WHERE id = ?', [cursoData, id], callback);
  }

  static delete(id, callback) {
    db.query('DELETE FROM cursos WHERE id = ?', [id], callback);
  }
}

module.exports = Curso;