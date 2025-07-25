const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// ========================================
// MULTER CONFIGURATION
// ========================================
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

// ========================================
// MAHASISWA CONTROLLERS
// ========================================

// Render halaman upload revisi laporan
const getRevisiPage = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) return res.redirect('/signin');
    
    const revisiList = await prisma.revisi_laporan.findMany({
      where: { email_user: emailUser },
      orderBy: { tanggal_upload: 'desc' }
    });

    // Ambil daftar dosen untuk dropdown
    const dosenList = await prisma.user.findMany({
      where: {
        role: 'DOSEN'
      },
      select: {
        email_user: true,
        nama: true
      },
      orderBy: {
        nama: 'asc'
      }
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
      revisiList: formattedRevisi,
      dosenList: dosenList
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
      return res.status(401).json({ 
        success: false, 
        message: 'User tidak terautentikasi' 
      });
    }
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'File revisi harus diupload' 
      });
    }

    // Cek apakah dosen_penerima dipilih
    const { dosen_penerima } = req.body;
    if (!dosen_penerima) {
      return res.status(400).json({
        success: false,
        message: 'Pilih dosen penerima revisi'
      });
    }


    const newRevisi = await prisma.revisi_laporan.create({
      data: {
        email_user: emailUser,
        file_laporan: req.file.filename,
        tanggal_upload: new Date(),
        feedback_dosen: `-`, 
        status: 'Menunggu Review',
        dosen_penerima: dosen_penerima
      }
    });

    res.json({ 
      success: true, 
      message: 'Revisi laporan berhasil diupload', 
      data: newRevisi 
    });

  } catch (error) {
    console.error('Error uploading revisi laporan:', error, req.file, req.session.user);
    
    if (req.file) {
      const filePath = path.join('uploads/revisi_laporan/', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan saat upload revisi laporan', 
      error: error.message, 
    });
  }
};

// Controller untuk download file revisi laporan
const downloadRevisi = async (req, res) => {
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

    // Cari revisi berdasarkan ID
    let revisi;
    if (userRole === 'DOSEN') {
      // Dosen dapat download semua revisi laporan
      revisi = await prisma.revisi_laporan.findFirst({
        where: {
          id_revisi: parseInt(id)
        }
      });
    } else {
      // Mahasiswa hanya dapat download revisi mereka sendiri
      revisi = await prisma.revisi_laporan.findFirst({
        where: {
          id_revisi: parseInt(id),
          email_user: emailUser
        }
      });
    }

    if (!revisi) {
      return res.status(404).json({
        success: false,
        message: 'Revisi laporan tidak ditemukan'
      });
    }

    const filePath = path.join(__dirname, '../uploads/revisi_laporan/', revisi.file_laporan);
    
    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    // Set header untuk download
    res.setHeader('Content-Disposition', `attachment; filename="${revisi.file_laporan}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream file ke response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading revisi laporan:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendownload file'
    });
  }
};

// Controller untuk mengambil data revisi laporan dalam format JSON (untuk AJAX)
const getRevisiLaporanData = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    
    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    const revisiList = await prisma.revisi_laporan.findMany({
      where: {
        email_user: emailUser
      },
      orderBy: {
        tanggal_upload: 'desc'
      }
    });

    const formattedRevisi = revisiList.map(revisi => ({
      ...revisi,
      tanggal_upload_formatted: new Date(revisi.tanggal_upload).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status_class: getStatusClass(revisi.status)
    }));

    res.json({
      success: true,
      data: formattedRevisi
    });

  } catch (error) {
    console.error('Error fetching revisi laporan data:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data revisi laporan'
    });
  }
};

// Controller untuk mengambil data proposal dalam format JSON (untuk AJAX) - untuk konsistensi
const getProposalData = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    
    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    const proposals = await prisma.proposal_ta.findMany({
      where: {
        email_user: emailUser
      },
      orderBy: {
        tanggal_upload: 'desc'
      }
    });

    const formattedProposals = proposals.map(proposal => ({
      ...proposal,
      tanggal_upload_formatted: new Date(proposal.tanggal_upload).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status_class: getStatusClass(proposal.status_review)
    }));

    res.json({
      success: true,
      data: formattedProposals
    });

  } catch (error) {
    console.error('Error fetching proposal data:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data proposal'
    });
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

// ========================================
// DOSEN CONTROLLERS
// ========================================

// Controller untuk dosen: menampilkan semua revisi laporan mahasiswa
const getAllRevisiForDosen = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.redirect('/signin');
    }

    const dosenEmail = req.session.user.email;

    const revisiList = await prisma.revisi_laporan.findMany({
      where: {
        dosen_penerima: dosenEmail
      },
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

// Controller untuk export PDF daftar revisi laporan mahasiswa
const exportRevisiLaporanPdf = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.status(403).send('Unauthorized');
    }
    
    const dosenEmail = req.session.user.email;
    
    const revisiList = await prisma.revisi_laporan.findMany({
      where: {
        dosen_penerima: dosenEmail
      },
      include: { user: { select: { nama: true } } },
      orderBy: { tanggal_upload: 'desc' }
    });
    
    const doc = new PDFDocument({ margin: 25, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="daftar_revisi_laporan_mahasiswa.pdf"');
    doc.pipe(res);
    doc.fontSize(14).font('Helvetica-Bold').text('Daftar Revisi Laporan Mahasiswa', { align: 'center' });
    doc.moveDown(1);
    // Kolom: No, Nama, File, Tanggal, Status, Feedback
    const col = [30, 65, 200, 280, 340, 420, 540];
    const rowHeight = 18;
    let y = doc.y;
    // Header
    doc.fontSize(9).font('Helvetica-Bold');
    doc.rect(col[0], y, col[6]-col[0], rowHeight).stroke();
    doc.text('No', col[0], y + 4, { width: col[1]-col[0], align: 'center' });
    doc.text('Nama Mahasiswa', col[1], y + 4, { width: col[2]-col[1], align: 'center' });
    doc.text('File Laporan', col[2], y + 4, { width: col[3]-col[2], align: 'center' });
    doc.text('Tanggal', col[3], y + 4, { width: col[4]-col[3], align: 'center' });
    doc.text('Status', col[4], y + 4, { width: col[5]-col[4], align: 'center' });
    doc.text('Feedback', col[5], y + 4, { width: col[6]-col[5], align: 'center' });
    // Garis vertikal header
    for (let i = 0; i < col.length; i++) {
      doc.moveTo(col[i], y).lineTo(col[i], y + rowHeight).stroke();
    }
    y += rowHeight;
    // Isi tabel
    doc.font('Helvetica').fontSize(8);
    revisiList.forEach((item, idx) => {
      doc.rect(col[0], y, col[6]-col[0], rowHeight).stroke();
      doc.text(idx + 1, col[0], y + 4, { width: col[1]-col[0], align: 'center' });
      doc.text((item.user?.nama || '-').substring(0, 25), col[1]+2, y + 4, { width: col[2]-col[1]-4, align: 'left' });
      doc.text((item.file_laporan || '-').substring(0, 20), col[2]+2, y + 4, { width: col[3]-col[2]-4, align: 'left' });
      doc.text(new Date(item.tanggal_upload).toLocaleDateString('id-ID').substring(0, 15), col[3]+2, y + 4, { width: col[4]-col[3]-4, align: 'left' });
      doc.text((item.status || '-').substring(0, 15), col[4]+2, y + 4, { width: col[5]-col[4]-4, align: 'left' });
      doc.text((item.feedback_dosen || '-').substring(0, 25), col[5]+2, y + 4, { width: col[6]-col[5]-4, align: 'left' });
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

// ========================================
// HELPER FUNCTIONS
// ========================================

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

// ========================================
// MODULE EXPORTS
// ========================================
module.exports = {
  getRevisiPage,
  uploadRevisi: [upload.single('revisiFile'), uploadRevisi],
  downloadRevisi,
  getAllRevisiForDosen,
  updateRevisiFeedback,
  deleteRevisiLaporan,
  exportRevisiLaporanPdf,
  getRevisiLaporanData,
  getProposalData
}; 