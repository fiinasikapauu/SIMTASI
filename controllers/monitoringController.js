const prisma = require('../middleware/auth');

const getMonitoringData = async (req, res) => {
  try {
    // Ambil data jumlah mahasiswa per dosen
    const data = await prisma.$queryRaw`
      SELECT
        u.nama AS nama_dosen,
        COUNT(p.id_pendaftaran) AS jumlah_mahasiswa
      FROM
        Pendaftaran_TA p
      JOIN
        User u ON p.id_dosen_pembimbing = u.email_user
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
