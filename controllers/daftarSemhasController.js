const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menampilkan halaman pendaftaran seminar atau status pendaftaran
const renderDaftarSeminar = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/signin');
    }

    // Cek apakah mahasiswa sudah terdaftar
    const pendaftaran = await prisma.pendaftaran_semhas.findFirst({
      where: { email_user: user.email },
    });

    if (pendaftaran) {
      // Jika sudah terdaftar, kirim data pendaftaran
      res.render('mahasiswa/sistemdaftarsemhas', {
        user: user,
        pendaftaran: {
          ...pendaftaran,
          tanggal_seminar_formatted: new Date(pendaftaran.tanggal_seminar).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        },
        jadwal: [], // Tidak perlu jadwal jika sudah terdaftar
      });
    } else {
      // Jika belum terdaftar, sediakan jadwal seminar
      const jadwalSeminar = [
        { tanggal: '2025-07-10T10:00:00.000Z', label: '10 Juli 2025, Sesi 1 (10:00)' },
        { tanggal: '2025-07-10T14:00:00.000Z', label: '10 Juli 2025, Sesi 2 (14:00)' },
        { tanggal: '2025-07-11T10:00:00.000Z', label: '11 Juli 2025, Sesi 1 (10:00)' },
      ];
      res.render('mahasiswa/sistemdaftarsemhas', {
        user: user,
        pendaftaran: null,
        jadwal: jadwalSeminar,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
};

// Menangani pendaftaran seminar baru
const handleDaftarSeminar = async (req, res) => {
  try {
    const { tanggal } = req.body;
    const emailUser = req.session.user?.email;

    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'Autentikasi dibutuhkan.' });
    }
    
    // Logika pendaftaran yang sudah ada...
    await prisma.pendaftaran_semhas.create({
      data: {
        email_user: emailUser,
        tanggal_seminar: new Date(tanggal),
        status: 'Terdaftar',
      },
    });

    res.json({ success: true, message: 'Pendaftaran seminar hasil berhasil!' });
  } catch (error) {
    console.error('Gagal mendaftarkan seminar:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// Menangani pembatalan pendaftaran
const handleBatalDaftar = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'Autentikasi dibutuhkan.' });
    }

    const result = await prisma.pendaftaran_semhas.deleteMany({
      where: { email_user: emailUser },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, message: 'Pendaftaran tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Pendaftaran berhasil dibatalkan.' });
  } catch (error) {
    console.error('Gagal membatalkan pendaftaran:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  renderDaftarSeminar,
  handleDaftarSeminar,
  handleBatalDaftar,
};
