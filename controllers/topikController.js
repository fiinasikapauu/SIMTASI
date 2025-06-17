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

module.exports = {
  addTopik,
};
