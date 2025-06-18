const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();  // Hanya deklarasikan sekali di sini

// Render halaman pendaftaran seminar
exports.renderDaftarSeminar = (req, res) => {
  res.render('mahasiswa/sistemdaftarsemhas'); // Pastikan nama view-nya benar
};

// Menangani form pendaftaran seminar
exports.daftarSeminar = async (req, res) => {
  const { email_user, file_draft, tanggal_daftar, status, jadwal } = req.body;

  // Validasi input
  if (!email_user || !file_draft || !tanggal_daftar || !status || !jadwal) {
    return res.status(400).send("Semua kolom harus diisi!");
  }

  // Validasi format tanggal jika perlu
  const isValidDate = !isNaN(new Date(tanggal_daftar).getTime()) && !isNaN(new Date(jadwal).getTime());
  if (!isValidDate) {
    return res.status(400).send("Tanggal tidak valid.");
  }

  try {
    // Menyimpan data seminar ke database
    await prisma.seminar_hasil.create({
      data: {
        email_user: email_user,
        file_draft: file_draft,
        tanggal_daftar: new Date(tanggal_daftar), // Pastikan format tanggal sesuai dengan database
        status: status,
        jadwal: new Date(jadwal),
      }
    });

    // Redirect ke halaman seminar setelah berhasil
    res.redirect('/sistemdaftarseminar'); 

  } catch (error) {
    console.error(error);
    
    // Menangani kesalahan yang mungkin terjadi saat proses penyimpanan
    res.status(500).send("Gagal menyimpan data seminar.");
  }
};
