const prisma = require('@prisma/client').PrismaClient;
const prismaClient = new prisma();

// Render halaman booking konsultasi
const renderBookingPage = async (req, res) => {
  try {
    // Ambil data dosen dari database
    const dosen = await prismaClient.user.findMany({
      where: {
        role: 'DOSEN'
      }
    });

    res.render('mahasiswa/bookingkonsul', { dosen });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan.');
  }
};

// Menangani pengiriman form booking
const createBooking = async (req, res) => {
  const { dosen, tanggal, waktu } = req.body;

  try {
    // Simpan data booking ke database
    const booking = await prismaClient.konsultasi.create({
      data: {
        email_user: req.user.email, // Ambil email pengguna yang login
        dosen_pembimbing: dosen,
        tanggal_konsultasi: new Date(`${tanggal}T${waktu}:00`),
        status: 'Pending',
      }
    });

    res.send('Booking konsultasi berhasil!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat melakukan booking.');
  }
};

module.exports = {
  renderBookingPage,
  createBooking,
};
