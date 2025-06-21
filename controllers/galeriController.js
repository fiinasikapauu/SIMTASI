const prisma = require('../middleware/auth');  // Prisma client atau database connection 

// Controller untuk menampilkan Galeri Judul TA yang Selesai
const getFinishedTA = async (req, res) => {
  try {
    // Query untuk mendapatkan mahasiswa yang sudah mendaftar sidang dan statusnya "selesai"
    const data = await prisma.pendaftaran_ta.findMany({
        where: {
        sidang_ta: { // Pastikan sidang_ta ada
        id_sidang: {},  // Pastikan sidang_ta ada (tidak null)
          }
      },
      include: {
        user: true,      // Mengambil data mahasiswa
        topikta: true,   // Mengambil data topik dari tabel 'topikta'
        sidang_ta: true, // Mengambil data sidang TA (tanggal dan tahun selesai)
      },
    });

    // Menyaring data untuk menampilkan nama, judul TA, dosen pembimbing, dan tahun selesai
    const finishedTA = data.map(item => {
      return {
        nama: item.user.nama,
        judul_ta: item.judul_ta,
        dosen_pembimbing: item.id_dosen_pembimbing,  // Dosen pembimbing
        tahun_selesai: item.sidang_ta ? item.sidang_ta.jadwal.getFullYear() : 'TBD',  // Ambil tahun dari tanggal sidang
      };
    });

    // Render ke halaman EJS dengan data yang telah difilter
    res.render('admin/galeriJudulTA', { mahasiswaList: finishedTA });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data.');
  }
};

module.exports = {
  getFinishedTA
};
