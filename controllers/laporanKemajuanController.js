const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { defineDmmfProperty } = require('@prisma/client/runtime/library');

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/laporan_kemajuan/';
    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Format nama file: upload_timestamp_originalname
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `upload_${timestamp}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Maksimal 10MB
  },
  fileFilter: (req, file, cb) => {
    // Hanya terima file PDF, DOC, dan DOCX
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file PDF, DOC, dan DOCX yang diperbolehkan!'), false);
    }
  }
});

// Controller untuk menampilkan halaman laporan kemajuan mahasiswa
const getLaporanKemajuanPage = async (req, res) => {
  try {
    // Ambil email user dari session
    const emailUser = req.session.user?.email;
    
    if (!emailUser) {
      return res.redirect('/signin');
    }

    // Ambil data laporan kemajuan berdasarkan email user yang login
    const laporanList = await prisma.laporan_kemajuan.findMany({
      where: {
        email_user: emailUser
      },
      orderBy: {
        tanggal_upload: 'desc' // Urutkan berdasarkan tanggal upload terbaru
      }
    });

    //asku sangat menyukai loly amle=amfdnids fnidfnnrxa aku sayanga jngija jng  f snf jsn 
    // Format tanggal untuk ditampilkan
    const formattedLaporan = laporanList.map(laporan => ({
      ...laporan,
      tanggal_upload_formatted: new Date(laporan.tanggal_upload).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status_class: getStatusClass(laporan.status_review)
    }));

    res.render('mahasiswa/uploadlaporankemajuan', {
      title: 'Laporan Kemajuan',
      user: req.session.user,
      laporanList: formattedLaporan
    });

  } catch (error) {
    console.error('Error fetching laporan kemajuan:', error);
    res.status(500).render('error', {
      message: 'Terjadi kesalahan saat mengambil data laporan kemajuan',
      error: error
    });
  }
};

// Controller untuk upload laporan kemajuan
const uploadLaporanKemajuan = async (req, res) => {
  try {
    // Ambil email user dari session
    const emailUser = req.session.user?.email;
    
    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    // Cek apakah file ada
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File laporan kemajuan harus diupload'
      });
    }

    // Simpan data ke database
    const newLaporan = await prisma.laporan_kemajuan.create({
      data: {
        email_user: emailUser,
        file_laporan: req.file.filename,
        tanggal_upload: new Date(),
        status_review: 'Menunggu Review',
        feedback_dosen: '-'
      }
    });

    res.json({
      success: true,
      message: 'Laporan kemajuan berhasil diupload',
      data: newLaporan
    });

  } catch (error) {
    console.error('Error uploading laporan kemajuan:', error, req.file, req.session.user);
    
    // Hapus file jika terjadi error
    if (req.file) {
      const filePath = path.join('uploads/laporan_kemajuan/', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupload laporan kemajuan',
      error: error.message
    });
  }
};

// Controller untuk download file laporan kemajuan
const downloadLaporanKemajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const emailUser = req.session.user?.email;
    const userRole = req.session.user?.role;

    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    // Cari laporan berdasarkan ID
    let laporan;
    if (userRole === 'DOSEN') {
      // Dosen dapat download semua laporan kemajuan
      laporan = await prisma.laporan_kemajuan.findFirst({
        where: {
          id_laporan: parseInt(id)
        }
      });
    } else {
      // Mahasiswa hanya dapat download laporan mereka sendiri
      laporan = await prisma.laporan_kemajuan.findFirst({
        where: {
          id_laporan: parseInt(id),
          email_user: emailUser
        }
      });
    }

    if (!laporan) {
      return res.status(404).json({
        success: false,
        message: 'Laporan kemajuan tidak ditemukan'
      });
    }

    const filePath = path.join(__dirname, '../uploads/laporan_kemajuan/', laporan.file_laporan);
    
    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    // Set header untuk download
    res.setHeader('Content-Disposition', `attachment; filename="${laporan.file_laporan}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream file ke response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading laporan kemajuan:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendownload file'
    });
  }
};

// Controller untuk dosen: menampilkan semua laporan kemajuan mahasiswa
const getAllLaporanKemajuanForDosen = async (req, res) => {
  try {
    // Pastikan user adalah dosen
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.redirect('/signin');
    }

    // Ambil semua laporan kemajuan beserta nama mahasiswa
    const laporanList = await prisma.laporan_kemajuan.findMany({
      include: {
        user: {
          select: { nama: true }
        }
      },
      orderBy: {
        tanggal_upload: 'desc'
      }
    });

    // Format tanggal dan data untuk EJS
    const formattedLaporan = laporanList.map(laporan => ({
      ...laporan,
      nama_mahasiswa: laporan.user?.nama || '-',
      tanggal_upload_formatted: new Date(laporan.tanggal_upload).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status_class: getStatusClass(laporan.status_review)
    }));

    res.render('dosen/laporankemajuan', {
      title: 'Daftar Laporan Kemajuan Mahasiswa',
      user: req.session.user,
      laporanList: formattedLaporan
    });
  } catch (error) {
    console.error('Error fetching all laporan kemajuan for dosen:', error);
    res.status(500).render('error', {
      message: 'Terjadi kesalahan saat mengambil data laporan kemajuan',
      error: error
    });
  }
};

// Controller untuk update feedback dosen
const updateLaporanKemajuanFeedback = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id_laporan, feedback_dosen, status_review } = req.body;
    if (!id_laporan || !feedback_dosen || !status_review) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }
    const updated = await prisma.laporan_kemajuan.update({
      where: { id_laporan: parseInt(id_laporan) },
      data: {
        feedback_dosen,
        status_review
      }
    });
    res.json({ success: true, message: 'Feedback berhasil disimpan', data: updated });
  } catch (error) {
    console.error('Error updating laporan kemajuan feedback:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan feedback' });
  }
};

// Controller untuk menghapus laporan kemajuan berdasarkan id_laporan dan file
const deleteLaporanKemajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const emailUser = req.session.user?.email;

    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    // Cari laporan berdasarkan ID dan email user
    const laporan = await prisma.laporan_kemajuan.findFirst({
      where: {
        id_laporan: parseInt(id),
        email_user: emailUser
      }
    });

    if (!laporan) {
      return res.status(404).json({
        success: false,
        message: 'Laporan kemajuan tidak ditemukan'
      });
    }

    // Hapus file dari sistem
    const filePath = path.join('uploads/laporan_kemajuan/', laporan.file_laporan);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Hapus data dari database
    try {
      await prisma.laporan_kemajuan.delete({
        where: { id_laporan: parseInt(id) }
      });
    } catch (err) {
      // Tangani error jika data sudah tidak ada
      return res.status(404).json({
        success: false,
        message: 'Laporan sudah dihapus atau tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      message: 'Laporan kemajuan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting laporan kemajuan:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus laporan kemajuan'
    });
  }
};

// Controller untuk export PDF daftar laporan kemajuan mahasiswa
const exportLaporanKemajuanPdf = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.status(403).send('Unauthorized');
    }
    const laporanList = await prisma.laporan_kemajuan.findMany({
      include: { user: { select: { nama: true } } },
      orderBy: { tanggal_upload: 'desc' }
    });
    const doc = new PDFDocument({ margin: 25, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="daftar_laporan_kemajuan_mahasiswa.pdf"');
    doc.pipe(res);
    doc.fontSize(14).font('Helvetica-Bold').text('Daftar Laporan Kemajuan Mahasiswa', { align: 'center' });
    doc.moveDown(1);
    // Kolom: No, Nama, File, Status, Feedback
    const col = [30, 65, 200, 340, 420, 540];
    const rowHeight = 18;
    let y = doc.y;
    // Header
    doc.fontSize(9).font('Helvetica-Bold');
    doc.rect(col[0], y, col[5]-col[0], rowHeight).stroke();
    doc.text('No', col[0], y + 4, { width: col[1]-col[0], align: 'center' });
    doc.text('Nama Mahasiswa', col[1], y + 4, { width: col[2]-col[1], align: 'center' });
    doc.text('File Laporan', col[2], y + 4, { width: col[3]-col[2], align: 'center' });
    doc.text('Status', col[3], y + 4, { width: col[4]-col[3], align: 'center' });
    doc.text('Feedback', col[4], y + 4, { width: col[5]-col[4], align: 'center' });
    // Garis vertikal header
    for (let i = 0; i < col.length; i++) {
      doc.moveTo(col[i], y).lineTo(col[i], y + rowHeight).stroke();
    }
    y += rowHeight;
    // Isi tabel
    doc.font('Helvetica').fontSize(8);
    laporanList.forEach((item, idx) => {
      doc.rect(col[0], y, col[5]-col[0], rowHeight).stroke();
      doc.text(idx + 1, col[0], y + 4, { width: col[1]-col[0], align: 'center' });
      doc.text((item.user && item.user.nama ? item.user.nama : '-').substring(0, 30), col[1]+2, y + 4, { width: col[2]-col[1]-4, align: 'left' });
      doc.text((item.file_laporan ? item.file_laporan : '-').substring(0, 25), col[2]+2, y + 4, { width: col[3]-col[2]-4, align: 'left' });
      doc.text((item.status_review ? item.status_review : '-').substring(0, 15), col[3]+2, y + 4, { width: col[4]-col[3]-4, align: 'left' });
      doc.text((item.feedback_dosen ? item.feedback_dosen : '-').substring(0, 30), col[4]+2, y + 4, { width: col[5]-col[4]-4, align: 'left' });
      // Garis vertikal isi
      for (let i = 0; i < col.length; i++) {
        doc.moveTo(col[i], y).lineTo(col[i], y + rowHeight).stroke();
      }
      y += rowHeight;
      // Page break jika melebihi batas
      if (y + rowHeight > doc.page.height - 40) {
        doc.addPage();
        y = 40;
      }
    });
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Gagal membuat PDF');
  }
};

// Helper function untuk menentukan class CSS berdasarkan status
function getStatusClass(status) {
  switch (status) {
    case 'Menunggu Review':
      return 'bg-yellow-100 text-yellow-800';
    case 'Disetujui':
      return 'bg-green-100 text-green-800';
    case 'Ditolak':
      return 'bg-red-100 text-red-800';
    case 'Revisi':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

module.exports = {
  getLaporanKemajuanPage,
  uploadLaporanKemajuan: [upload.single('laporanFile'), uploadLaporanKemajuan],
  downloadLaporanKemajuan,
  getAllLaporanKemajuanForDosen,
  updateLaporanKemajuanFeedback,
  deleteLaporanKemajuan,
  exportLaporanKemajuanPdf
}; 