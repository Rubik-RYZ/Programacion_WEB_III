const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const cursosRoutes = require('./controllers/cursosController');

app.use('/', cursosRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});