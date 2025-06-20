const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Menggunakan instansi PrismaClient

// Mengambil data mahasiswa untuk form
exports.getMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await prisma.user.findMany({
      where: {
        role: 'MAHASISWA', // Menyaring hanya mahasiswa
      },
      select: {
        email_user: true,
        nama: true,
      },
    });
    const { status } = req.query; // ambil status dari query
    res.render('dosen/feedback', { mahasiswa, status }); // kirim status ke view
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Menyimpan feedback yang diisi
exports.saveFeedback = async (req, res) => {
  const { email_user, tanggal, feedback_text } = req.body;
  
  try {
    await prisma.feedback.create({
      data: {
        email_user,
        tanggal: new Date(tanggal), // Mengkonversi tanggal dari form
        feedback_text,
      },
    });
    // Mengarahkan kembali ke halaman feedback setelah berhasil dengan status query parameter
    res.redirect('/feedback?status=success');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
