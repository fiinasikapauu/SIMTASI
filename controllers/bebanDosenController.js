const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mengambil data monitoring beban dosen
exports.getMonitoringBeban = async (req, res) => {
  try {
    // Mengambil data beban dosen dari database
    const bebanDosen = await prisma.dosen.findMany({
      include: {
        bimbingan: true,  // Mengambil data bimbingan dosen
      }
    });

    // Menampilkan data monitoring beban dosen
    res.render('monitoring-beban-dosen', { bebanDosen });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Fungsi untuk memperbarui beban bimbingan dosen
exports.updateBebanBimbingan = async (req, res) => {
  const { dosenId, bebanBaru } = req.body;  // Mendapatkan data dosenId dan bebanBaru dari form

  if (!dosenId || !bebanBaru) {
    return res.status(400).send('Data yang diperlukan tidak lengkap');
  }

  try {
    // Memperbarui beban bimbingan dosen
    const updatedDosen = await prisma.dosen.update({
      where: { email_user: dosenId },
      data: {
        bebanBimbingan: bebanBaru,  // Memperbarui nilai beban
      },
    });

    // Mengirim respons sukses dalam bentuk JSON
    res.json({
      success: true,
      message: 'Beban bimbingan dosen berhasil diperbarui!',
      updatedDosen,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui beban dosen.',
    });
  }
};
