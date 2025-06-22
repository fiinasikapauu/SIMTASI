const prisma = require('../middleware/auth'); // Prisma client atau database connection

// Mengambil data draft yang statusnya "Menunggu"
exports.getValidasiDraft = async (req, res) => {
  try {
    const daftarDraft = await prisma.pendaftaran_semhas.findMany({
      where: { status: 'Menunggu' },
      include: {
        user: true
      }
    });

    // Mengecek data draft dan menampilkan di halaman validasi
    res.render('admin/validasidraftsemhas', {
      daftarDraft: daftarDraft.map(d => ({
        id: d.id,
        nama: d.user.nama,
        nim: d.user.nomorInduk,
        file_draft: d.file_draft,
        tanggal: new Date(d.waktu_pendaftaran).toLocaleDateString('id-ID'),
        status: d.status
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// Update status draft semhas (Setuju atau Tolak)
exports.updateStatusDraft = async (req, res) => {
  try {
    const { status } = req.body;
    const id = parseInt(req.params.id); // Mengambil ID dari params URL

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID tidak valid' });
    }

    // Memperbarui status di database
    await prisma.pendaftaran_semhas.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, message: 'Status berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};
