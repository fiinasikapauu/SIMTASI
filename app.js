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

// Middleware agar variabel user selalu tersedia di semua view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


const feedbackRoutes = require('./routes/feedbackRoutes'); // Tambahan route feedback
const roleRoutes = require('./routes/roleRoutes'); // Updated route
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const daftartaonlineRoutes = require('./routes/daftartaonlineRoutes');
const authRouter = require('./routes/auth');
const jadwalRoute = require("./routes/jadwal");
const topikRoutes = require('./routes/topikRoutes');
const draftSidangRoute = require("./routes/draftSidang");
const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes
const monitoringRoutes = require('./routes/monitoringRoutes');  // Pastikan path ini benar
const bodyParser = require('body-parser');
const pemberianNilaiRoute = require("./routes/pemberianNilai");
const kalenderAdminRoutes = require('./routes/kalenderAdminRoutes');
const riwayatRoutes = require('./routes/riwayatfeedbackdosenRoutes');
const riwayat2Routes = require('./routes/riwayatfeedbacklagiRoutes');
const cors = require('cors');
const draftRouter = require('./routes/draft');
const daftarSemhasRouter = require('./routes/daftarSemhasRoutes');
const kalenderAdminController = require('./controllers/kalenderAdminController');
const kalenderMahasiswaRoutes = require('./routes/kalenderMahasiswaRoutes');
const kalenderMahasiswaController = require('./controllers/kalenderMahasiswaController');
const hasilKonsultasiRoutes = require('./routes/hasilKonsultasiRoutes');


app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));

app.use(session({
  secret: 'rahasiaTA',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Menggunakan https di production
    httpOnly: true  // Cookie hanya bisa diakses oleh server
  }
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
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Menonaktifkan request untuk favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end())

// Menggunakan body-parser untuk menangani form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Menggunakan EJS sebagai template engine


app.use(monitoringRoutes); 

app.use('/feedback', feedbackRoutes); // Route baru untuk feedback
app.use(hasilKonsultasiRoutes);

app.use('/', roleRoutes);
app.use("/sidang/pemberian-nilai", pemberianNilaiRoute);

app.use(riwayatRoutes);
app.use(riwayat2Routes);
app.use('/riwayatfeedbacklagi', riwayat2Routes);

app.use(feedbackRoutes); // Ini akan membuat route /feedback tersedia

app.use(monitoringRoutes); // Pastikan route digunakan dengan benar
app.use('/kalender-sidang', kalenderAdminRoutes)
app.use('/kalender', kalenderMahasiswaRoutes); // Menggunakan route kalender mahasiswa

// Router utama
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRouter); // Gunakan router untuk auth (signup & signin)
app.use('/', topikRoutes); // Menggunakan routing untuk topik
app.use('/', bookingRoutes); // Gunakan routing untuk booking konsultasi dosen
app.use('/', draftRouter);
app.use('/', daftarSemhasRouter);

app.get('/kalender-sidang', kalenderAdminController.getKalenderSidangPage);
app.get('/kalender', kalenderMahasiswaController.getKalenderPage);


app.get('/bookingkonsul', (req, res) => {
  res.render('mahasiswa/bookingkonsul'); // Pastikan nama file di sini sama dengan nama file EJS
}); 

app.get('/approvaldospem', (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/login');  // Jika belum login, redirect ke halaman login
  }
  res.render('dosen/approvaldospem');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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