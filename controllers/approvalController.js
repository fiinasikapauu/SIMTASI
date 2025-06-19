const prisma = require('../middleware/auth'); 

const getApprovalData = async (req, res) => {
    try {
    const dosenEmail = req.session.userEmail; // Ambil email dosen yang login dari session

    console.log("Fetching data for dosen with email:", dosenEmail);
    const data = await prisma.pendaftaran_ta.findMany({
        where: {
        id_dosen_pembimbing: dosenEmail,
        status_approval: "Menunggu",  // Filtering students with null approval
        },
        include: {
        user: true,
        topikta: true,
        },
    });
    console.log("Data fetched:", data); // Log the fetched data to see what's returned
    res.render('dosen/approvaldospem', { mahasiswaList: data });
    } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data.');
    }
};
// Controller untuk memperbarui status persetujuan mahasiswa
const updateApprovalStatus = async (req, res) => {
  const { approvalData } = req.body;  // Data persetujuan yang dikirimkan dari frontend

  try {
    // Melakukan iterasi melalui approvalData dan memperbarui status untuk setiap mahasiswa
    for (const approval of approvalData) {
      await prisma.pendaftaran_ta.update({
        where: { id_pendaftaran: approval.id_pendaftaran },  // Menemukan mahasiswa berdasarkan ID mereka
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
