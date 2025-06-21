const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk merender halaman kalender sidang
exports.getKalenderSidangPage = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/signin');
        }

        // Ambil semua jadwal yang sudah ada untuk admin ini
        const existingEvents = await prisma.kalender_sidang.findMany({
            where: {
                email_user: user.email
            }
        });

        res.render('admin/kalender-sidang', {
            user: user,
            events: JSON.stringify(existingEvents) // Kirim sebagai JSON string
        });
    } catch (error) {
        console.error('Error getting calendar page:', error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

exports.saveSidangDate = async (req, res) => {
    try {
        // Ambil data dari request body
        const { tanggal, jenis_sidang } = req.body;
        const email_user = req.session.user?.email;

        // Periksa apakah semua data sudah ada
        if (!tanggal || !jenis_sidang || !email_user) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap atau sesi tidak valid' });
        }

        const eventDate = new Date(tanggal);

        // Cek apakah jadwal dengan jenis yang sama sudah ada pada tanggal tersebut
        const existingEvent = await prisma.kalender_sidang.findFirst({
            where: {
                email_user: email_user,
                jenis_sidang: jenis_sidang,
                tanggal: {
                    gte: new Date(eventDate.setUTCHours(0, 0, 0, 0)),
                    lt: new Date(eventDate.setUTCHours(23, 59, 59, 999))
                }
            }
        });

        if (existingEvent) {
            return res.status(409).json({ success: false, message: 'Jadwal dengan jenis yang sama sudah ada pada tanggal ini.' });
        }

        // Menyimpan tanggal sidang ke dalam database menggunakan Prisma
        const newSidang = await prisma.kalender_sidang.create({
            data: {
                email_user: email_user,      // Email pengguna
                tanggal: new Date(tanggal),  // Tanggal yang dipilih
                jenis_sidang: jenis_sidang,  // Jenis sidang, misalnya "TA" atau "SEMHAS"
            },
        });

        // Mengirimkan respons sukses
        return res.status(200).json({ success: true, sidang: newSidang });
    } catch (error) {
        console.error('Error saving sidang date:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk menghapus tanggal sidang
exports.clearSidangDate = async (req, res) => {
    try {
        const { tanggal } = req.body;
        const email_user = req.session.user?.email;

        if (!tanggal || !email_user) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }

        // Tentukan rentang waktu untuk hari yang dipilih
        const startDate = new Date(tanggal);
        startDate.setUTCHours(0, 0, 0, 0); // Set ke awal hari (UTC)

        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 1); // Set ke awal hari berikutnya

        // Hapus semua data sidang dalam rentang tanggal tersebut untuk pengguna ini
        const deletedSidang = await prisma.kalender_sidang.deleteMany({
            where: {
                email_user: email_user,
                tanggal: {
                    gte: startDate, // Greater than or equal to the start of the day
                    lt: endDate,    // Less than the start of the next day
                },
            },
        });

        if (deletedSidang.count === 0) {
            return res.status(404).json({ success: false, message: 'Tanggal tidak ditemukan untuk dihapus' });
        }

        return res.status(200).json({ success: true, count: deletedSidang.count });
    } catch (error) {
        console.error('Error clearing sidang date:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

