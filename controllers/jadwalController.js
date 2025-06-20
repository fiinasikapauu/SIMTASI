const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller untuk menyimpan jadwal baru
const submitJadwal = async (req, res) => {
  const { jenis_jadwal, tanggal, waktu } = req.body;

  try {
    const newJadwal = await prisma.jadwal_sidang_seminar.create({
      data: {
        jenis_jadwal: jenis_jadwal,
        tanggal: new Date(tanggal),
        waktu: new Date(`${tanggal}T${waktu}:00`), // Menggabungkan tanggal dan waktu
        admin_id: req.session.user.email_user, // Pastikan session admin sudah terisi
      },
    });
    res.redirect('/jadwal'); // Redirect ke halaman jadwal setelah sukses
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat menyimpan jadwal");
  }
};

module.exports = { submitJadwal };
