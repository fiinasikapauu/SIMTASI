const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mengambil riwayat konsultasi
exports.getRiwayatKonsultasi = async (req, res) => {
  try {
    const riwayat = await prisma.feedback.findMany({
      include: {
        user: {
          select: {
            nama: true, // Mengambil nama mahasiswa dari tabel user
          },
        },
      },
      orderBy: {
        tanggal: 'desc', // Mengurutkan berdasarkan tanggal terbaru
      },
    });

    console.log("Status parameter:", req.query.status);  // Tambahkan log untuk memeriksa status
    res.render('dosen/riwayatfeedbacklagi', { riwayat, status: req.query.status });  // Pastikan status diteruskan ke tampilan
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


// Fungsi untuk mengupdate riwayat konsultasi
exports.updateRiwayatKonsultasi = async (req, res) => {
  const { id_feedback } = req.params; // Mengambil id_feedback dari parameter URL
  const { feedback_text } = req.body; // Mengambil teks feedback baru

  try {
    // Mengupdate data riwayat konsultasi berdasarkan ID
    await prisma.feedback.update({
      where: {
        id_feedback: parseInt(id_feedback), // Pastikan ID adalah integer
      },
      data: {
        feedback_text, // Update feedback_text
      },
    });

     // Redirect ke halaman riwayat dengan status=updated
    res.redirect('/riwayatfeedbacklagi?status=updated');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate riwayat.',
    });
  }
};
