const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Konfigurasi multer untuk upload file revisi laporan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/revisi_laporan/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `revisi_${timestamp}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file PDF, DOC, dan DOCX yang diperbolehkan!'), false);
    }
  }
});

// Render halaman upload revisi laporan
const getRevisiPage = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) return res.redirect('/signin');
    const revisiList = await prisma.revisi_laporan.findMany({
      where: { email_user: emailUser },
      orderBy: { tanggal_upload: 'desc' }
    });
    const formattedRevisi = revisiList.map(item => ({
      ...item,
      tanggal_upload_formatted: new Date(item.tanggal_upload).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    }));
    res.render('mahasiswa/uploadrevisilaporan', {
      title: 'Upload Revisi Laporan',
      user: req.session.user,
      revisiList: formattedRevisi
    });
  } catch (error) {
    console.error('Error fetching revisi laporan:', error);
    res.status(500).render('error', {
      message: 'Terjadi kesalahan saat mengambil data revisi laporan',
      error: error
    });
  }
};

// Upload revisi laporan
const uploadRevisi = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File revisi harus diupload' });
    }
    const newRevisi = await prisma.revisi_laporan.create({
      data: {
        email_user: emailUser,
        file_laporan: req.file.filename,
        tanggal_upload: new Date(),
        feedback_dosen: '-',
        status: 'Menunggu Review'
      }
    });
    res.json({ success: true, message: 'Revisi laporan berhasil diupload', data: newRevisi });
  } catch (error) {
    console.error('Error uploading revisi laporan:', error, req.file, req.session.user);
    if (req.file) {
      const filePath = path.join('uploads/revisi_laporan/', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat upload revisi laporan', error: error.message, prisma: error });
  }
};

// Controller untuk download file revisi laporan
const downloadRevisi = async (req, res) => {
  try {
    const { id } = req.params;
    const emailUser = req.session.user?.email;
    if (!emailUser) {
      return res.status(401).json({ success: false, message: 'User tidak terautentikasi' });
    }
    // Cari revisi berdasarkan ID dan email user
    const revisi = await prisma.revisi_laporan.findFirst({
      where: {
        id_revisi: parseInt(id),
        email_user: emailUser
      }
    });
    if (!revisi) {
      return res.status(404).json({ success: false, message: 'Revisi laporan tidak ditemukan' });
    }
    const filePath = path.join(__dirname, '../uploads/revisi_laporan/', revisi.file_laporan);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File tidak ditemukan' });
    }
    res.setHeader('Content-Disposition', `attachment; filename="${revisi.file_laporan}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading revisi laporan:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mendownload file' });
  }
};

// Controller untuk dosen: menampilkan semua revisi laporan mahasiswa
const getAllRevisiForDosen = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.redirect('/signin');
    }
    const revisiList = await prisma.revisi_laporan.findMany({
      include: {
        user: { select: { nama: true } }
      },
      orderBy: { tanggal_upload: 'desc' }
    });
    const formattedRevisi = revisiList.map(item => ({
      ...item,
      nama_mahasiswa: item.user?.nama || '-',
      tanggal_upload_formatted: new Date(item.tanggal_upload).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    }));
    res.render('dosen/revisilaporan', {
      title: 'Daftar Revisi Laporan Mahasiswa',
      user: req.session.user,
      revisiList: formattedRevisi
    });
  } catch (error) {
    console.error('Error fetching revisi laporan for dosen:', error);
    res.status(500).render('error', {
      message: 'Terjadi kesalahan saat mengambil data revisi laporan',
      error: error
    });
  }
};

// Controller untuk update feedback dosen pada revisi laporan
const updateRevisiFeedback = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id_revisi, feedback_dosen, status } = req.body;
    if (!id_revisi || !feedback_dosen || !status) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }
    const updated = await prisma.revisi_laporan.update({
      where: { id_revisi: parseInt(id_revisi) },
      data: { feedback_dosen, status }
    });
    res.json({ success: true, message: 'Feedback berhasil disimpan', data: updated });
  } catch (error) {
    console.error('Error updating revisi feedback:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan feedback' });
  }
};

// Controller untuk menghapus revisi laporan berdasarkan id_revisi dan file
const deleteRevisiLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const emailUser = req.session.user?.email;

    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    // Cari revisi berdasarkan ID dan email user
    const revisi = await prisma.revisi_laporan.findFirst({
      where: {
        id_revisi: parseInt(id),
        email_user: emailUser
      }
    });

    if (!revisi) {
      return res.status(404).json({
        success: false,
        message: 'Revisi laporan tidak ditemukan'
      });
    }

    // Hapus file dari sistem
    const filePath = path.join('uploads/revisi_laporan/', revisi.file_laporan);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Hapus data dari database
    try {
      await prisma.revisi_laporan.delete({
        where: { id_revisi: parseInt(id) }
      });
    } catch (err) {
      // Tangani error jika data sudah tidak ada
      return res.status(404).json({
        success: false,
        message: 'Revisi sudah dihapus atau tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      message: 'Revisi laporan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting revisi laporan:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus revisi laporan'
    });
  }
};

// Controller untuk export PDF daftar revisi laporan mahasiswa
const exportRevisiLaporanPdf = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.status(403).send('Unauthorized');
    }
    const revisiList = await prisma.revisi_laporan.findMany({
      include: { user: { select: { nama: true } } },
      orderBy: { tanggal_upload: 'desc' }
    });
    const doc = new PDFDocument({ margin: 25, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="daftar_revisi_laporan_mahasiswa.pdf"');
    doc.pipe(res);
    doc.fontSize(14).font('Helvetica-Bold').text('Daftar Revisi Laporan Mahasiswa', { align: 'center' });
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
    revisiList.forEach((item, idx) => {
      doc.rect(col[0], y, col[5]-col[0], rowHeight).stroke();
      doc.text(idx + 1, col[0], y + 4, { width: col[1]-col[0], align: 'center' });
      doc.text((item.user && item.user.nama ? item.user.nama : '-').substring(0, 30), col[1]+2, y + 4, { width: col[2]-col[1]-4, align: 'left' });
      doc.text((item.file_laporan ? item.file_laporan : '-').substring(0, 25), col[2]+2, y + 4, { width: col[3]-col[2]-4, align: 'left' });
      doc.text((item.status ? item.status : '-').substring(0, 15), col[3]+2, y + 4, { width: col[4]-col[3]-4, align: 'left' });
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

module.exports = {
  getRevisiPage,
  uploadRevisi: [upload.single('revisiFile'), uploadRevisi],
  downloadRevisi,
  getAllRevisiForDosen,
  updateRevisiFeedback,
  deleteRevisiLaporan,
  exportRevisiLaporanPdf
}; 