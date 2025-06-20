const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menangani pengambilan halaman pendaftaran topik TA
exports.getRegistrationPage = async (req, res) => {
    try {
        // Mengambil semua topik yang tersedia
        const topics = await prisma.topikta.findMany();

        // Mengambil email mahasiswa dari session atau JWT
        const emailUser = req.session.email || null;  // Asumsi email disimpan di session, sesuaikan dengan autentikasi Anda

        if (!emailUser) {
            return res.status(401).send("Anda harus login sebagai mahasiswa.");
        }

        // Mengambil data mahasiswa berdasarkan email
        const mahasiswa = await prisma.user.findUnique({
            where: { email: emailUser },
        });

        // Jika mahasiswa tidak ditemukan
        if (!mahasiswa || mahasiswa.role !== 'MAHASISWA') {
            return res.status(403).send("Role Anda bukan mahasiswa.");
        }

        // Kirim data topik dan mahasiswa ke halaman pendaftaran
        res.render('mahasiswa/daftartaonline', { topics, mahasiswa });
    } catch (err) {
        console.error(err);
        res.status(500).send("Terjadi kesalahan saat memuat halaman.");
    }
};

// Menangani pengiriman pendaftaran topik TA
exports.submitRegistration = async (req, res) => {
    const { topikId, judul } = req.body;

    // Mengambil email mahasiswa dari session atau JWT
    const emailUser = req.session.email || null;  // Asumsi email disimpan di session, sesuaikan dengan autentikasi Anda

    if (!emailUser) {
        return res.status(401).send("Anda harus login sebagai mahasiswa.");
    }

    try {
        // Menyimpan pendaftaran baru ke database
        await prisma.pendaftaran_ta.create({
            data: {
                id_topikta: parseInt(topikId),
                judul_ta: judul,
                email_user: emailUser,  // Menggunakan email mahasiswa yang terautentikasi
                tanggal_daftar: new Date(),
                status_approval: "Pending",
                id_dosen_pembimbing: null,  // Mengatur null jika tidak memilih dosen
            }
        });

        // Mengarahkan kembali ke halaman pendaftaran untuk menampilkan daftar yang terupdate
        res.redirect('/daftartaonline');
    } catch (err) {
        console.error(err);
        res.status(500).send("Terjadi kesalahan saat mengirim pendaftaran.");
    }
};
