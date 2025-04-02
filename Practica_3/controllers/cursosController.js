const express = require('express');
const router = express.Router();
const Curso = require('../models/cursoModel');

router.get('/', (req, res) => {
  Curso.getAll((err, results) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).send('Error fetching courses');
    }
    res.render('index', { cursos: results });
  });
});

router.get('/create', (req, res) => {
  res.render('create');
});

router.post('/create', (req, res) => {
  const { nombre, descripcion, duracion, precio } = req.body;
  const nuevoCurso = { nombre, descripcion, duracion, precio };
  
  Curso.create(nuevoCurso, (err, result) => {
    if (err) {
      console.error('Error creating course:', err);
      return res.status(500).send('Error creating course');
    }
    res.redirect('/');
  });
});

router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  
  Curso.getById(id, (err, results) => {
    if (err || results.length === 0) {
      console.error('Error fetching course:', err);
      return res.status(404).send('Course not found');
    }
    res.render('edit', { curso: results[0] });
  });
});

router.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, duracion, precio } = req.body;
  const cursoActualizado = { nombre, descripcion, duracion, precio };
  
  Curso.update(id, cursoActualizado, (err, result) => {
    if (err) {
      console.error('Error updating course:', err);
      return res.status(500).send('Error updating course');
    }
    res.redirect('/');
  });
});

router.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  
  Curso.delete(id, (err, result) => {
    if (err) {
      console.error('Error deleting course:', err);
      return res.status(500).send('Error deleting course');
    }
    res.redirect('/');
  });
});

module.exports = router;