const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const multer = require('multer');
const app = express();

app.use(session({
  secret: 'rahasiaTA', 
  resave: false,
  saveUninitialized: true,
    cookie: { 
    secure: false,          // Pastikan secure di-set ke false jika menggunakan http (bukan https)
    httpOnly: true          // Hanya dapat diakses melalui http, untuk mencegah XSS
  }
}));


const feedbackRoutes = require('./routes/feedbackRoutes'); // Tambahan route feedback
const roleRoutes = require('./routes/roleRoutes'); // Updated route
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const topikRoutes = require('./routes/topikRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes
const monitoringRoutes = require('./routes/monitoringRoutes');  // Pastikan path ini benar
const seminarRoutes = require('./routes/seminarRoutes');
const bodyParser = require('body-parser');
const sidangRoutes = require('./routes/sidangRoutes');  // Mengimpor routes
const kalenderRoutes = require('./routes/kalenderRoutes');

app.use(session({
  secret: 'rahasiaTA', // Secret key untuk meng-hash session
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // jika Anda menggunakan HTTP, jika menggunakan HTTPS set ke true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Menambahkan middleware untuk menangani data form
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Konfigurasi session
 

// Menggunakan body-parser untuk menangani form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Menggunakan EJS sebagai template engine
app.use(express.static(path.join(__dirname, 'public')));

<<<<<<<<< Temporary merge branch 1

=========
app.use('/', monitoringRoutes);  // Tanpa '/api', langsung menggunakan '/' untuk path
>>>>>>>>> Temporary merge branch 2
app.use('/feedback', feedbackRoutes); // Route baru untuk feedback

app.use('/', roleRoutes);
app.use('/sidang', sidangRoutes); // Memastikan /sidang di sini



app.use(feedbackRoutes); // Ini akan membuat route /feedback tersedia

app.use(monitoringRoutes); // Pastikan route digunakan dengan benar
app.use('/', seminarRoutes)
app.use('/', kalenderRoutes)


// Router utama
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRouter); // Gunakan router untuk auth (signup & signin)
app.use('/', topikRoutes); // Menggunakan routing untuk topik
app.use('/', bookingRoutes); // Gunakan routing untuk booking konsultasi dosen

app.get('/bookingkonsul', (req, res) => {
  res.render('mahasiswa/bookingkonsul'); // Pastikan nama file di sini sama dengan nama file EJS
}); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static files
app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads/proposals', express.static(path.join(__dirname, 'uploads/proposals')));
app.use('/uploads/revisi_laporan', express.static(path.join(__dirname, 'uploads/revisi_laporan')));
app.use('/uploads/laporan_kemajuan', express.static(path.join(__dirname, 'uploads/laporan_kemajuan')));

app.get('/approvaldospem', (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/login');  // Jika belum login, redirect ke halaman login
  }
  res.render('dosen/approvaldospem');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use((error, req, res, next) => {
  console.error(error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File terlalu besar. Maksimal 10MB.'
      });
    }
  }
  
  if (error.message === 'Hanya file PDF, DOC, dan DOCX yang diperbolehkan!') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server'
  });
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

module.exports = app;