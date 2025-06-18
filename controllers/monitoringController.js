const prisma = require('../middleware/auth'); // Prisma client atau database connection

const getMonitoringData = async (req, res) => {
  try {
    // Ambil data dosen dan jumlah mahasiswa yang dibimbing
    const data = await prisma.$queryRaw`
      SELECT 
        u.nama AS nama_dosen,
        COALESCE(COUNT(p.id_pendaftaran), 0) AS jumlah_mahasiswa
      FROM 
        User u
      LEFT JOIN 
        Pendaftaran_TA p ON p.id_dosen_pembimbing = u.email_user
      WHERE 
        u.role = 'DOSEN'
      GROUP BY 
        u.nama
    `;
    
    res.render('admin/monitoringbebandosen', { data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data.');
  }
};

module.exports = {
  getMonitoringData,
};
