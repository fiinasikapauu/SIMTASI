const { PrismaClient, user_role } = require('@prisma/client');
const prisma = new PrismaClient();

const getMonitoringData = async (req, res) => {
  try {
    // Ambil data dosen dan jumlah mahasiswa yang dibimbing
    const data = await prisma.$queryRaw`
      SELECT 
        u.dosen AS nama_dosen,   -- Mengambil nama dosen dari tabel topikta
        COALESCE(COUNT(p.id_pendaftaran), 0) AS jumlah_mahasiswa
      FROM 
        topikta u
      LEFT JOIN 
        pendaftaran_ta p ON p.id_topikta = u.id_topikta  -- Menjaga relasi dengan pendaftaran_ta
      GROUP BY 
        u.dosen;   -- Mengelompokkan berdasarkan nama dosen
    `;
    
    // Mengirim data ke view untuk ditampilkan
    res.render('admin/bebandosen', { data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data.');
  }
};

module.exports = {
  getMonitoringData,
};
