const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menampilkan halaman pendaftaran sidang atau status pendaftaran
const renderDaftarSidang = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/signin');
    }

    // Cek apakah mahasiswa sudah terdaftar di sidang
    const pendaftaran = await prisma.sidang_ta.findFirst({
      where: { email_user: user.email },
    });

    if (pendaftaran) {
      // Jika sudah terdaftar, kirim data pendaftaran
      res.render('mahasiswa/sistemdaftarsidang', {
        user: user,
        pendaftaran: {
          ...pendaftaran,
          jadwal_sidang_formatted: new Date(pendaftaran.jadwal).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        },
        jadwal: [], // Tidak perlu jadwal jika sudah terdaftar
      });
    } else {
      // Jika belum terdaftar, gunakan data dummy sampai fitur penjadwalan selesai
      const jadwalDummy = [
        { value: '2025-07-15T10:00:00.000Z', label: '15 Juli 2025, Sesi Pagi (10:00)' },
        { value: '2025-07-15T14:00:00.000Z', label: '15 Juli 2025, Sesi Siang (14:00)' },
        { value: '2025-07-16T10:00:00.000Z', label: '16 Juli 2025, Sesi Pagi (10:00)' },
        { value: '2025-07-16T14:00:00.000Z', label: '16 Juli 2025, Sesi Siang (14:00)' },
      ];

      res.render('mahasiswa/sistemdaftarsidang', {
        user: user,
        pendaftaran: null,
        jadwal: jadwalDummy, // Menggunakan data dummy
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan pada server');
  }
};

// Menangani pendaftaran sidang baru
const handleDaftarSidang = async (req, res) => {
  try {
    const { tanggal_sidang } = req.body; // Menerima tanggal dari form
    const emailUser = req.session.user?.email;

    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'Autentikasi dibutuhkan.' });
    }

    // 1. Cek apakah sudah terdaftar
    const existingSidang = await prisma.sidang_ta.findFirst({ where: { email_user: emailUser } });
    if (existingSidang) {
      return res.status(400).json({ success: false, message: 'Anda sudah terdaftar untuk sidang TA.' });
    }

    // Pengecekan pendaftaran TA dihapus agar bisa mendaftar tanpa syarat.
    
    // Buat record sidang_ta baru menggunakan tanggal dari form
    await prisma.sidang_ta.create({
      data: {
        email_user: emailUser,
        tanggal_daftar: new Date(),
        jadwal: new Date(tanggal_sidang), // Menggunakan tanggal yang dipilih dari form
        nilai_akhir: 0,
      },
    });

    res.json({ success: true, message: 'Pendaftaran sidang berhasil!' });
  } catch (error) {
    console.error('Gagal mendaftarkan sidang:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// Menangani pembatalan pendaftaran sidang
const handleBatalDaftarSidang = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'Autentikasi dibutuhkan.' });
    }

    // Hapus record pendaftaran sidang milik user
    const result = await prisma.sidang_ta.deleteMany({
      where: { email_user: emailUser },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, message: 'Pendaftaran tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Pendaftaran sidang berhasil dibatalkan.' });
  } catch (error) {
    console.error('Gagal membatalkan pendaftaran:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  renderDaftarSidang,
  handleDaftarSidang,
  handleBatalDaftarSidang,
};