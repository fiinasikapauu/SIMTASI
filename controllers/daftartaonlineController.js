const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRegistrationPage = async (req, res) => {
  try {
    const emailUser = req.session.user?.email;
    if (!emailUser) return res.redirect('/signin');

    const mahasiswa = await prisma.user.findUnique({
      where: { email_user: emailUser }
    });

    if (!mahasiswa || mahasiswa.role !== 'MAHASISWA') {
      return res.status(403).send("Akses hanya untuk mahasiswa.");
    }

    const topics = await prisma.topikta.findMany();

    const users = await prisma.pendaftaran_ta.findMany({
      include: {
        user: true,
        topikta: true
      }
    });

    res.render('mahasiswa/daftartaonline', {
      topics,
      mahasiswa,
      users
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat memuat halaman.");
  }
};

exports.submitRegistration = async (req, res) => {
  try {
    const { topikId, judul } = req.body;
    const emailUser = req.session.user?.email;
    if (!emailUser) return res.redirect('/signin');

    if (!topikId || !judul.trim()) {
      return res.status(400).send("Topik dan judul harus diisi.");
    }

    const existing = await prisma.pendaftaran_ta.findFirst({
      where: { email_user: emailUser }
    });

    if (existing) {
      return res.status(400).send("Anda sudah mendaftar topik TA.");
    }

    await prisma.pendaftaran_ta.create({
      data: {
        email_user: emailUser,
        id_topikta: parseInt(topikId),
        judul_ta: judul,
        tanggal_daftar: new Date(),
        status_approval: "Pending",
        id_dosen_pembimbing: null
      }
    });

    res.redirect('/daftartaonline');
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat submit pendaftaran.");
  }
};
