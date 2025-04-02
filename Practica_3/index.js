const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cursosdb'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const cursosRoutes = require('./controllers/cursosController');

app.use('/', cursosRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});