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
        email_user: true, // Pastikan email_user juga diambil
      },
    });

    res.render('dosen/pemberian-nilai', { mahasiswa });
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
    res.status(500).send('Error fetching mahasiswa');
  }
};

// Controller untuk menerima nilai yang diberikan oleh dosen dan memperbarui nilai
const submitNilai = async (req, res) => {
  const { nomorInduk, updatedData } = req.body; // Ambil updatedData dari body


  // Validasi input nilai dan nomorInduk
  if (!nomorInduk || !updatedData || Object.keys(updatedData).length === 0) {
    console.error("Invalid input data:", { nomorInduk, updatedData });
    return res.status(400).send('Nilai tidak valid atau updatedData tidak ditemukan');
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
    // Pastikan updatedData ada dan berisi data yang diperlukan
    if (updatedData[user.email_user]) { // Cek apakah data ada di updatedData
      const nilai_akhir = updatedData[user.email_user]; // Ambil nilai_akhir dari updatedData berdasarkan email_user

      // Update nilai di tabel sidang_ta berdasarkan email_user
      await prismaClient.sidang_ta.update({
        where: { email_user: user.email_user }, // Mencari berdasarkan email_user
        data: { nilai_akhir: parseFloat(nilai_akhir) }, // Konversi nilai_akhir menjadi tipe float
      });

      console.log("Nilai berhasil diperbarui untuk mahasiswa dengan nomor induk:", nomorInduk);
    } else {
      console.error("Data nilai untuk email_user tidak ditemukan dalam updatedData");
      return res.status(400).send('Data nilai untuk email_user tidak ditemukan dalam updatedData');
    }

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
