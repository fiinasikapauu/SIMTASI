const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getKalenderPage: async (req, res) => {
        try {
            // Ambil data dari tabel jadwal_sidang_seminar
            const jadwal = await prisma.jadwal_sidang_seminar.findMany({
                orderBy: {
                    waktu_mulai: 'asc' // Urutkan berdasarkan waktu
                }
            });

            // Render view kalender mahasiswa dan teruskan data jadwal
            res.render('mahasiswa/kalender', { jadwal }); // Ganti nama variabel menjadi 'jadwal'
        } catch (error) {
            console.error("Error fetching calendar data:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};