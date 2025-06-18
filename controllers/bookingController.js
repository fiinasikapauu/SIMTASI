const prisma = require('@prisma/client').PrismaClient;
const prismaClient = new prisma();

// Render halaman booking konsultasi
const renderBookingPage = async (req, res) => {
  try {
    // Ambil data dosen pembimbing dari model topikta
    const topikta = await prismaClient.topikta.findMany({
      select: {
        dosen: true,  // Ambil hanya nama dosen
      },
      distinct: ['dosen'],  // Pastikan dosen yang ditampilkan unik
    });

    // Ekstrak dosen unik
    const dosenList = topikta.map(item => item.dosen);

    res.render('mahasiswa/bookingkonsul', { dosen: dosenList });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan.');
  }
};

// Menangani pengiriman form booking
const createBooking = async (req, res) => {
  const { dosen, tanggal, waktu } = req.body;
  const emailUser = req.user.email; // Ambil email dari session pengguna yang login

  try {
    // Simpan data booking ke tabel `konsultasi`
    await prismaClient.konsultasi.create({
      data: {
        email_user: emailUser, // Menggunakan email dari session pengguna
        dosen_pembimbing: dosen,
        tanggal_konsultasi: new Date(`${tanggal}T${waktu}:00`), // Format waktu yang valid
        status: 'Pending',
      }
    });

    // Mengirim response sukses ke frontend
    res.json({ success: true, message: 'Booking Sesi Konsultasi Berhasil!' });

  } catch (error) {
    console.error(error);
    // Jika terjadi error, kirimkan response error ke frontend
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat melakukan booking.' });
  }
};

module.exports = {
  renderBookingPage,
  createBooking,
};
