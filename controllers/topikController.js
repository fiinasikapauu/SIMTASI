// controllers/topikController.js
const prisma = require('../middleware/auth'); 

const addTopik = async (req, res) => {
  const { topik, dosen } = req.body;  

  try {
    // Cek apakah ada topik dan dosen yang sama
    const existingTopik = await prisma.topikta.findFirst({
      where: {
        topik: topik,
        dosen: dosen
      }
    });

    if (existingTopik) {
      // Mengalihkan halaman dengan query parameter success=false
      return res.redirect('/daftartopikta?success=false&message=Topik%20dan%20Dosen%20sudah%20ada');
    }

    // Jika data valid, simpan data baru
    await prisma.topikta.create({
      data: {
        topik: topik,
        dosen: dosen,
        waktu: new Date(),
      },
    });

    // Mengarahkan kembali dengan success=true
    res.redirect('/daftartopikta?success=true&message=Data%20berhasil%20disimpan!');
  } catch (error) {
    console.error(error);
    res.redirect('/daftartopikta?success=false&message=Terjadi%20kesalahan%20saat%20menyimpan%20data');
  }
};

// Menampilkan Daftar Topik yang Tersedia
const getTopikTATersedia = async (req, res) => {
  try {
    const topikList = await prisma.topikta.findMany();
    res.render('mahasiswa/topiktatersedia', { topikList });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data',
      success: false,
    });
  }
};

// Menampilkan Daftar Topik yang Tersedia
const getTopikTersedia = async (req, res) => {
  try {
    const topikList = await prisma.topikta.findMany();
    res.render('admin/daftartopiktersedia', { topikList });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat mengambil data',
      success: false,
    });
  }
};

// Fungsi untuk menghapus topik
const deleteTopik = async (req, res) => {
  const { id_topikta } = req.params;

  try {
    // Menghapus data topik berdasarkan ID
    const deletedTopik = await prisma.topikta.delete({
      where: {
        id_topikta: Number(id_topikta),
      },
    });

    res.json({
      message: 'Topik berhasil dihapus!',
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus topik',
      success: false,
    });
  }
};

module.exports = {
  addTopik,
  getTopikTersedia,
  getTopikTATersedia,
  deleteTopik
};
