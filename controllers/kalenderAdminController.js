const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk merender halaman kalender sidang
exports.getKalenderSidangPage = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/signin');
        }

        // Ambil semua jadwal dari jadwal_sidang_seminar
        const existingEvents = await prisma.jadwal_sidang_seminar.findMany({
            // Jika Anda hanya ingin admin melihat jadwal yang mereka buat:
            // where: { admin_id: user.email } 
        });

        res.render('admin/kalender-sidang', {
            user: user,
            // Ubah nama field agar sesuai dengan view: waktu_mulai -> tanggal, jenis_jadwal -> jenis_sidang
            events: JSON.stringify(existingEvents.map(e => ({...e, tanggal: e.waktu_mulai, jenis_sidang: e.jenis_jadwal}))) 
        });
    } catch (error) {
        console.error('Error getting calendar page:', error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
};

// Fungsi untuk menyimpan jadwal baru
exports.saveSidangDate = async (req, res) => {
    try {
        const { tanggal, jenis_jadwal } = req.body; // Disesuaikan dengan nama di view
        const admin_id = req.session.user?.email;

        if (!tanggal || !jenis_jadwal || !admin_id) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap atau sesi tidak valid' });
        }

        // Gabungkan tanggal dari kalender dengan waktu default (misal: 12:00)
        const waktu_mulai = new Date(`${tanggal}T12:00:00`);
        const waktu = new Date();
        waktu.setHours(12, 0, 0, 0);

        const newJadwal = await prisma.jadwal_sidang_seminar.create({
            data: {
                admin_id: admin_id,
                jenis_jadwal: jenis_jadwal,
                tanggal: waktu_mulai,
                waktu: waktu,
            },
        });

        return res.status(200).json({ success: true, jadwal: newJadwal });
    } catch (error) {
        console.error('Error saving jadwal date:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

// Fungsi untuk menghapus semua jadwal pada tanggal tertentu
exports.clearSidangDate = async (req, res) => {
    try {
        const { tanggal } = req.body;
        const admin_id = req.session.user?.email;

        if (!tanggal || !admin_id) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }
        
        const startDate = new Date(tanggal);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const deletedJadwal = await prisma.jadwal_sidang_seminar.deleteMany({
            where: {
                // Hapus semua jadwal pada hari itu, terlepas dari siapa adminnya
                // Jika ingin hanya admin yang bersangkutan bisa hapus, tambahkan: admin_id: admin_id
                waktu_mulai: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });

        if (deletedJadwal.count === 0) {
            return res.status(404).json({ success: false, message: 'Tidak ada jadwal untuk dihapus pada tanggal ini' });
        }

        return res.status(200).json({ success: true, count: deletedJadwal.count });
    } catch (error) {
        console.error('Error clearing sidang date:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};

