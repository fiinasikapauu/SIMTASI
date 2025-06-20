const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/proposals/';
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

// Controller untuk menampilkan halaman proposal
const getProposalPage = async (req, res) => {
  try {
    // Ambil email user dari session
    const emailUser = req.session.user?.email;
    
    console.log('Session user:', req.session.user);
    console.log('Email user from session:', emailUser);
    
    if (!emailUser) {
      console.log('No email user found, redirecting to signin');
      return res.redirect('/signin');
    }

    console.log('Fetching proposals for user:', emailUser);

    // Check all proposals in database for debugging
    const allProposals = await prisma.proposal_ta.findMany();
    console.log('All proposals in database:', allProposals.length);
    console.log('All proposals data:', allProposals);

    // Ambil data proposal berdasarkan email user yang login
    const proposals = await prisma.proposal_ta.findMany({
      where: {
        email_user: emailUser
      },
      orderBy: {
        tanggal_upload: 'desc' // Urutkan berdasarkan tanggal upload terbaru
      }
    });

    console.log('Found proposals for user:', proposals.length);
    console.log('Proposals data:', proposals);

    // Format tanggal untuk ditampilkan
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

    console.log('Formatted proposals:', formattedProposals.length);

    res.render('mahasiswa/uploadproposalta', {
      title: 'Proposal Tugas Akhir',
      user: req.session.user,
      proposals: formattedProposals
    });

  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).render('error', {
      message: 'Terjadi kesalahan saat mengambil data proposal',
      error: error
    });
  }
};

// Controller untuk upload proposal
const uploadProposal = async (req, res) => {
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
        message: 'File proposal harus diupload'
      });
    }

    // Simpan data ke database
    const newProposal = await prisma.proposal_ta.create({
      data: {
        email_user: emailUser,
        file_proposal: req.file.filename,
        tanggal_upload: new Date(),
        status_review: 'Menunggu Review',
        feedback_dosen: '-'
      }
    });

    res.json({
      success: true,
      message: 'Proposal berhasil diupload',
      data: newProposal
    });

  } catch (error) {
    console.error('Error uploading proposal:', error, req.file, req.session.user);
    
    // Hapus file jika terjadi error
    if (req.file) {
      const filePath = path.join('uploads/proposals/', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupload proposal',
      error: error.message
    });
  }
};

// Controller untuk mengambil data proposal dalam format JSON (untuk AJAX)
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

// Controller untuk download file proposal
const downloadProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const emailUser = req.session.user?.email;

    if (!emailUser) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    // Cari proposal berdasarkan ID dan email user
    const proposal = await prisma.proposal_ta.findFirst({
      where: {
        id_proposal: parseInt(id),
        email_user: emailUser
      }
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal tidak ditemukan'
      });
    }

    const filePath = path.join(__dirname, '../uploads/proposals/', proposal.file_proposal);
    
    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    // Set header untuk download
    res.setHeader('Content-Disposition', `attachment; filename="${proposal.file_proposal}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream file ke response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendownload file'
    });
  }
};

// Controller untuk dosen: menampilkan semua proposal mahasiswa
const getAllProposalsForDosen = async (req, res) => {
  try {
    // Pastikan user adalah dosen
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.redirect('/signin');
    }

    // Ambil semua proposal beserta nama mahasiswa
    const proposals = await prisma.proposal_ta.findMany({
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
    const formattedProposals = proposals.map(proposal => ({
      ...proposal,
      nama_mahasiswa: proposal.user?.nama || '-',
      tanggal_upload_formatted: new Date(proposal.tanggal_upload).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status_class: getStatusClass(proposal.status_review)
    }));

    res.render('dosen/proposalta', {
      title: 'Daftar Proposal Mahasiswa',
      user: req.session.user,
      proposals: formattedProposals
    });
  } catch (error) {
    console.error('Error fetching all proposals for dosen:', error);
    res.status(500).render('error', {
      message: 'Terjadi kesalahan saat mengambil data proposal',
      error: error
    });
  }
};

// Controller untuk update feedback dosen
const updateProposalFeedback = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'DOSEN') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id_proposal, feedback_dosen, status_review } = req.body;
    if (!id_proposal || !feedback_dosen || !status_review) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }
    
    console.log('Updating proposal feedback:', { id_proposal, feedback_dosen, status_review });
    
    const updated = await prisma.proposal_ta.update({
      where: { id_proposal: parseInt(id_proposal) },
      data: {
        feedback_dosen,
        status_review
      }
    });
    
    console.log('Proposal updated successfully:', updated);
    
    // Verify the proposal still exists after update
    const verification = await prisma.proposal_ta.findFirst({
      where: { id_proposal: parseInt(id_proposal) }
    });
    
    console.log('Verification - proposal still exists:', !!verification);
    if (verification) {
      console.log('Verification - proposal data:', {
        id: verification.id_proposal,
        email: verification.email_user,
        status: verification.status_review,
        feedback: verification.feedback_dosen
      });
    }
    
    res.json({ success: true, message: 'Feedback berhasil disimpan', data: updated });
  } catch (error) {
    console.error('Error updating proposal feedback:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan feedback' });
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
  getProposalPage,
  uploadProposal: [upload.single('proposalFile'), uploadProposal],
  getProposalData,
  downloadProposal,
  getAllProposalsForDosen,
  updateProposalFeedback
};