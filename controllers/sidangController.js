const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient(); // Pastikan ini diinisialisasi dengan benar

// Controller untuk menampilkan daftar mahasiswa
const getPemberianNilai = async (req, res) => {
  try {
    const mahasiswa = await prismaClient.user.findMany({
      where: {
        role: 'MAHASISWA',
      },
      select: {
        nama: true,
        nomorInduk: true, // Mengambil nomorInduk
      },
    });

    res.render('dosen/pemberian-nilai', { mahasiswa });
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
    res.status(500).send('Error fetching mahasiswa');
  }
};

// Controller untuk menerima nilai yang diberikan oleh dosen
const submitNilai = async (req, res) => {
  const { nomorInduk, nilai_akhir } = req.body;

  // Validasi input nilai dan nomorInduk
  if (!nomorInduk || isNaN(nilai_akhir) || nilai_akhir < 0 || nilai_akhir > 100) {
    console.error("Invalid input data:", { nomorInduk, nilai_akhir });
    return res.status(400).send('Nilai tidak valid atau nomorInduk tidak ditemukan');
  }

  try {
    console.log("Menyimpan nilai untuk mahasiswa dengan nomor induk:", nomorInduk);

    // Cari user berdasarkan nomorInduk
    const user = await prismaClient.user.findUnique({
      where: {
        nomorInduk: nomorInduk, // Menggunakan nomorInduk untuk mencari mahasiswa
      },
    });

    // Jika mahasiswa tidak ditemukan
    if (!user) {
      console.error('Mahasiswa tidak ditemukan dengan nomor induk:', nomorInduk);
      return res.status(404).send('Mahasiswa dengan nomor induk tersebut tidak ditemukan');
    }

    // Menyimpan nilai ke sidang_ta dengan email_user yang sesuai
    const sidang = await prismaClient.sidang_ta.create({
      data: {
        email_user: user.email_user, // Menggunakan email_user dari user yang ditemukan
        nilai_akhir: parseFloat(nilai_akhir), // Konversi nilai ke tipe data float
        tanggal_daftar: new Date(), // Tanggal saat nilai diberikan
        jadwal: new Date(), // Misalnya jadwal diset ke tanggal saat ini
        // file_draft_sidang dapat dikosongkan jika tidak digunakan pada tahap ini
      },
    });

    console.log("Nilai berhasil disubmit untuk mahasiswa dengan nomor induk:", nomorInduk);
    res.redirect('/sidang/pemberian-nilai'); // Redirect kembali ke halaman pemberian nilai
  } catch (error) {
    console.error("Error saat mengirim nilai:", error);
    res.status(500).send('Error submitting nilai');
  }
};

module.exports = {
  getPemberianNilai,
  submitNilai,
};
