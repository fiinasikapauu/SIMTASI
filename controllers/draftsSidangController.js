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

// Controller untuk menampilkan halaman
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
    console.error('Error getting draft seminar hasil page:', error);
    res.status(500).send('Internal Server Error');
  }
};

const uploadDraftSidang = async (req, res) => {
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
        message: 'File draft sidang harus diupload',
      });
    }

    // 1. Cari data sidang_ta yang aktif untuk mahasiswa ini
    const sidangTa = await prisma.sidang_ta.findFirst({
      where: {
        email_user: emailUser,
        // Anda mungkin perlu menambahkan kondisi lain di sini, 
        // misalnya status sidang yang masih aktif atau belum selesai.
      },
      orderBy: {
        tanggal_daftar: 'desc', // Ambil yang terbaru jika ada banyak
      },
    });

    if (!sidangTa) {
      return res.status(404).json({
        success: false,
        message: 'Data pendaftaran sidang tidak ditemukan untuk Anda. Pastikan Anda sudah mendaftar sidang.',
      });
    }

    // 2. Gunakan id_sidang dari data yang ditemukan
    const newDraftSidang = await prisma.draft_sidang.create({
      data: {
        email_user: emailUser,
        id_sidang: sidangTa.id_sidang, // Tambahkan id_sidang di sini
        file_draft_sidang: req.file.filename,
        tgl_upload: new Date(),
        status_draft: 'Menunggu',
        balasan_dosen: '-',
      },
    });

    res.json({
      success: true,
      message: 'Draft sidang berhasil diupload',
      data: newDraftSidang,
    });
  } catch (error) {
    console.error('Error uploading draft sidang:', error);
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupload draft sidang',
      error: error.message,
    });
  }
};

const deleteDraftSidang = async (req, res) => {
  const { id } = req.params;
  const emailUser = req.session.user?.email;

  try {
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi' });
    }

    // Temukan record terlebih dahulu untuk mendapatkan nama file
    const draft = await prisma.draft_sidang.findUnique({
      where: { id_draftsidang: parseInt(id) },
    });

    if (!draft || draft.email_user !== emailUser) {
      return res.status(404).json({ success: false, message: 'Draft tidak ditemukan atau Anda tidak punya hak akses' });
    }

    // Hapus record dari database TERLEBIH DAHULU
    await prisma.draft_sidang.delete({
      where: { id_draftsidang: parseInt(id) },
    });

    // Kemudian, coba hapus file dari filesystem secara asynchronous
    const filePath = path.join(uploadDir, draft.file_draft_sidang);
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
  getDraftSidangPage,
  uploadDraftSidang,
  deleteDraftSidang,
  upload,
};