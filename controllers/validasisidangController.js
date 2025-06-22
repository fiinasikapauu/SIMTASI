const prisma = require('../middleware/auth'); // Prisma client atau database connection

exports.getValidasiDraftSidang = async (req, res) => {
  try {
    // Fetch data from the draft_sidang table where the status is 'Menunggu'
    const daftarDraftSidang = await prisma.draft_sidang.findMany({
      where: { status_draft: 'Menunggu' },
      include: {
        user: true // Assuming there is a relation with user
      }
    });

    res.render('admin/validasidraftsidang', {
      daftarDraftSidang: daftarDraftSidang.map(d => ({
        id: d.id_draftsidang,
        nama: d.user.nama,
        nim: d.user.nomorInduk,
        file_draft_sidang: d.file_draft_sidang,
        tanggal: new Date(d.tgl_upload).toLocaleDateString('id-ID'),
        status: d.status_draft
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

exports.updateStatusDraftSidang = async (req, res) => {
  try {
    const { status } = req.body;
    const id = parseInt(req.params.id); // pastikan req.params.id adalah angka

    await prisma.draft_sidang.update({
      where: { id_draftsidang: id },
      data: { status_draft: status }
    });

    res.json({ success: true, message: 'Status berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};