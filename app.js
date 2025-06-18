const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const bodyParser = require('body-parser');
const topikRoutes = require('./routes/topikRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Konfigurasi session
app.use(session({
  secret: 'rahasiaTA',
  resave: false,
  saveUninitialized: true
}));

// Menggunakan body-parser untuk menangani form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Menggunakan EJS sebagai template engine
app.use(express.static(path.join(__dirname, 'public')));

// Router utama
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRouter); // Gunakan router untuk auth (signup & signin)
app.use('/', topikRoutes);// Menggunakan routing untuk topik

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Route untuk halaman utama (Home)
app.get('/', (req, res) => {
  res.render('home'); // Render home.ejs atau halaman utama
});


// Rute untuk halaman Booking Sesi Konsultasi Dosen
app.get('/bookingkonsul', (req, res) => {
  res.render('bookingkonsul'); // 'booking' adalah nama file EJS tanpa ekstensi
});


module.exports = app;





