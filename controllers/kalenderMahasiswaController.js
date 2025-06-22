const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getKalenderPage: async (req, res) => {
        try {
            // Ambil data dari tabel jadwal_sidang_seminar
            const jadwalData = await prisma.jadwal_sidang_seminar.findMany({
                orderBy: {
                    tanggal: 'asc' // Urutkan berdasarkan tanggal
                }
            });

            // Gabungkan tanggal dan waktu menjadi satu properti untuk kemudahan di view
            const jadwal = jadwalData.map(item => {
                const waktuMulai = new Date(item.tanggal);
                const waktu = new Date(item.waktu);
                waktuMulai.setHours(waktu.getHours());
                waktuMulai.setMinutes(waktu.getMinutes());
                
                return {
                    ...item,
                    waktu_mulai: waktuMulai
                };
            });

            // Render view kalender mahasiswa dan teruskan data jadwal
            res.render('mahasiswa/kalender', { jadwal });
        } catch (error) {
            console.error("Error fetching calendar data:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};