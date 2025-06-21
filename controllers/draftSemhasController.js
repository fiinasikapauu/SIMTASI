const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan direktori upload ada
const uploadDir = path.join(__dirname, '../uploads/draftsemhas');
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

// Controller untuk menampilkan halaman
const getDraftSemhasPage = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    const drafts = await prisma.draft_semhas.findMany({
      where: { email_user: emailUser },
      orderBy: { tanggal_upload: 'desc' },
    });
    res.render('mahasiswa/uploaddraftsemhas', {
      user: req.session.user,
      drafts: drafts.map((d) => ({
        ...d,
        tanggal_upload_formatted: d.tanggal_upload
          ? new Date(d.tanggal_upload).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : 'N/A',
      })),
    });
  } catch (error) {
    console.error('Error getting draft seminar hasil page:', error);
    res.status(500).send('Internal Server Error');
  }
};

const uploadDraftSemhas = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi',
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File draft seminar hasil harus diupload',
      });
    }
    const newDraftSemhas = await prisma.draft_semhas.create({
      data: {
        email_user: emailUser,
        file_draft: req.file.filename,
        tanggal_upload: new Date(),
        status: 'Menunggu',
        tanggapan_dosen: '-',
      },
    });
    res.json({
      success: true,
      message: 'Draft seminar hasil berhasil diupload',
      data: newDraftSemhas,
    });
  } catch (error) {
    console.error('Error uploading draft seminar hasil:', error);
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupload draft seminar hasil',
      error: error.message,
    });
  }
};

const deleteDraftSemhas = async (req, res) => {
  const { id } = req.params;
  const emailUser = req.session.user?.email;

  try {
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi' });
    }

    // Temukan record terlebih dahulu untuk mendapatkan nama file
    const draft = await prisma.draft_semhas.findUnique({
      where: { id_semhas: parseInt(id) },
    });

    if (!draft || draft.email_user !== emailUser) {
      return res.status(404).json({ success: false, message: 'Draft tidak ditemukan atau Anda tidak punya hak akses' });
    }

    // Hapus record dari database TERLEBIH DAHULU
    await prisma.draft_semhas.delete({
      where: { id_semhas: parseInt(id) },
    });

    // Kemudian, coba hapus file dari filesystem secara asynchronous
    const filePath = path.join(uploadDir, draft.file_draft);
    fs.unlink(filePath, (err) => {
      if (err) {
        // Jika gagal, catat error di server tapi jangan kirim error ke client
        console.error(`Gagal menghapus file orphaned: ${filePath}`, err);
      } else {
        console.log(`Berhasil menghapus file orphaned: ${filePath}`);
      }
    });

    // Langsung kirim respons sukses
    res.json({ success: true, message: 'Draft berhasil dihapus' });

  } catch (error) {
    // Catch block ini sekarang utamanya akan menangkap error dari operasi database
    console.error('Error saat operasi database untuk penghapusan draft:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server saat menghapus draft' });
  }
};

module.exports = {
  getDraftSemhasPage,
  uploadDraftSemhas,
  deleteDraftSemhas,
  upload,
};