const prisma = require('../middleware/auth');  // Prisma client atau database connection

// Controller untuk menampilkan Galeri Judul TA yang Selesai
const getFinishedTA = async (req, res) => {
  try {
    // Query untuk mendapatkan mahasiswa yang sudah mendaftar sidang dan statusnya "selesai"
    const data = await prisma.pendaftaran_ta.findMany({
      where: {
        sidang_ta: {
          NOT: {
            id_sidang: null,  // Memastikan mahasiswa sudah mendaftar sidang
          },
        },
        seminar_hasil: {
          status: "selesai", // Memastikan seminar hasilnya sudah selesai
        },
      },
      include: {
        user: true,      // Mengambil data mahasiswa
        topikta: true,   // Mengambil data topik dari tabel 'topikta'
        sidang_ta: true, // Mengambil data sidang TA (tanggal dan tahun selesai)
        seminar_hasil: true, // Mengambil data seminar hasil yang sudah selesai
      },
    });

    // Menyaring data untuk menampilkan nama, judul TA, dosen pembimbing, dan tahun selesai
    const finishedTA = data.map(item => {
      return {
        nama: item.user.nama,
        judul_ta: item.judul_ta,
        dosen_pembimbing: item.id_dosen_pembimbing,
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
