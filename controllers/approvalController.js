const prisma = require('../middleware/auth'); // Prisma client atau database connection

// Controller untuk mengambil data persetujuan mahasiswa
const getApprovalData = async (req, res) => {
  try {
    // Mendapatkan email dosen yang login dari session
    const dosenEmail = req.session.user.email; // Pastikan mengambil email dari session user

    if (!dosenEmail) {
      return res.status(403).send('Dosen belum login');
    }

    // Query untuk mengambil data mahasiswa yang memilih dosen yang sedang login
    const data = await prisma.pendaftaran_ta.findMany({
      where: {
        status_approval: "Menunggu",  // Menampilkan mahasiswa yang statusnya belum disetujui
        id_dosen_pembimbing: dosenEmail, // Memfilter mahasiswa yang memilih dosen ini
      },
      include: {
        user: true,
        topikta: true,
      },
    });

    res.render('dosen/approvaldospem', { mahasiswaList: data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data.');
  }
};

const updateApprovalStatus = async (req, res) => {
  const { approvalData } = req.body;  // Data persetujuan yang dikirimkan dari frontend

  try {
    // Melakukan iterasi melalui approvalData dan memperbarui status untuk setiap mahasiswa
    for (const approval of approvalData) {
      // Pastikan id_pendaftaran dikirim sebagai angka
      const idPendaftaran = parseInt(approval.id_pendaftaran, 10);

      // Pastikan idPendaftaran adalah angka dan bukan NaN
      if (isNaN(idPendaftaran)) {
        return res.status(400).json({
          message: 'ID Pendaftaran tidak valid',
          success: false
        });
      }

      await prisma.pendaftaran_ta.update({
        where: { id_pendaftaran: idPendaftaran },  // Menemukan mahasiswa berdasarkan ID mereka
        data: { status_approval: approval.status_approval },  // Memperbarui status persetujuan
      });
    }

    res.json({
      message: 'Status persetujuan berhasil diperbarui',  // Respons sukses
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui status persetujuan',  // Respons error
      success: false,
    });
  }
};


module.exports = {
  getApprovalData,
  updateApprovalStatus
};
