// controllers/topikController.js
const prisma = require('../middleware/auth'); 

const addTopik = async (req, res) => {
  const { topik, dosen } = req.body;  

  try {
    const newTopik = await prisma.topikta.create({
      data: {
        topik: topik,
        dosen: dosen,
        waktu: new Date(),
      },
    });

    // Menambahkan redirect agar bisa memberi notifikasi sukses
    res.redirect('/daftartopikta?success=true'); // Redirect ke halaman daftar topik
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat menyimpan data',
      success: false,
    });
  }
};

module.exports = {
  addTopik,
};
