const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan direktori upload ada
const uploadDir = path.join(__dirname, '../uploads/draftsidang');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Controller untuk menampilkan halaman upload draft sidang (untuk Mahasiswa)
const getDraftSidangPage = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    const drafts = await prisma.draft_sidang.findMany({
      where: { email_user: emailUser },
      orderBy: { tgl_upload: 'desc' },
    });
    res.render('mahasiswa/uploaddraftsidang', {
      user: req.session.user,
      drafts: drafts.map((d) => ({
        ...d,
        tgl_upload_formatted: d.tgl_upload
          ? new Date(d.tgl_upload).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : 'N/A',
      })),
    });
  } catch (error) {
    console.error('Error getting draft sidang page for mahasiswa:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Controller untuk meng-handle upload draft sidang (untuk Mahasiswa)
const uploadDraftSidang = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File draft sidang harus diupload' });
    }
    
    const sidangTa = await prisma.sidang_ta.findFirst({
      where: { email_user: emailUser },
      orderBy: { tanggal_daftar: 'desc' },
    });

    if (!sidangTa) {
      return res.status(404).json({ success: false, message: 'Data pendaftaran sidang tidak ditemukan. Pastikan Anda sudah mendaftar sidang.' });
    }

    const newDraftSidang = await prisma.draft_sidang.create({
      data: {
        email_user: emailUser,
        id_sidang: sidangTa.id_sidang,
        file_draft_sidang: req.file.filename,
        tgl_upload: new Date(),
        status_draft: 'Menunggu',
        balasan_dosen: '-',
      },
    });

    res.json({ success: true, message: 'Draft sidang berhasil diupload', data: newDraftSidang });
  } catch (error) {
    console.error('Error uploading draft sidang:', error);
    if (req.file) {
      fs.unlinkSync(path.join(uploadDir, req.file.filename));
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengupload draft sidang', error: error.message });
  }
};

// Controller untuk menghapus draft sidang (untuk Mahasiswa)
const deleteDraftSidang = async (req, res) => {
  const { id } = req.params;
  const emailUser = req.session.user?.email;

  try {
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi' });
    }

    const draft = await prisma.draft_sidang.findUnique({
      where: { id_draftsidang: parseInt(id) },
    });

    if (!draft || draft.email_user !== emailUser) {
      return res.status(404).json({ success: false, message: 'Draft tidak ditemukan atau Anda tidak punya hak akses' });
    }

    await prisma.draft_sidang.delete({
      where: { id_draftsidang: parseInt(id) },
    });
    
    fs.unlink(path.join(uploadDir, draft.file_draft_sidang), (err) => {
      if (err) console.error(`Gagal menghapus file: ${draft.file_draft_sidang}`, err);
    });

    res.json({ success: true, message: 'Draft berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat menghapus draft' });
  }
};

module.exports = {
  getDraftSidangPage,
  uploadDraftSidang,
  deleteDraftSidang,
  upload,
};
