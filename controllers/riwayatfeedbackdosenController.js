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

    res.render('admin/riwayatfeedbackdosen', { riwayat });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Fungsi untuk menghapus riwayat konsultasi
exports.deleteRiwayatKonsultasi = async (req, res) => {
  const { id_feedback } = req.params; // Mengambil id_feedback dari parameter URL
  try {
    // Menghapus data riwayat konsultasi berdasarkan ID
    await prisma.feedback.delete({
      where: {
        id_feedback: parseInt(id_feedback), // Pastikan ID adalah integer
      },
    });

    res.redirect('/riwayatfeedbackdosen?status=success'); // Redirect setelah penghapusan
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus riwayat.',
    });
  }
};
