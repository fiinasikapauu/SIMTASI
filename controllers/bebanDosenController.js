// controllers/bebanDosenController.js
const prisma = require('@prisma/client').PrismaClient;
const prismaClient = new prisma();
//fatih
// Mengambil data dosen dan beban bimbingan
exports.getMonitoringBeban = async (req, res) => {
    try {
        const dosenList = await prismaClient.user.findMany({
            where: {
                role: 'DOSEN',
            },
        });

        // Render halaman EJS dengan data dosen
        res.render('admin/monitoring-beban', { dosenList, status: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi Kesalahan Internal');
    }
};

// Memperbarui beban bimbingan
exports.updateBebanBimbingan = async (req, res) => {
    try {
        const updatedData = req.body;
        
        // Memperbarui beban bimbingan dosen berdasarkan email_user
        for (const email in updatedData) {
            if (email.startsWith('beban_')) {
                const email_user = email.split('_')[1];
                const beban_bimbingan = updatedData[email];

                await prismaClient.user.update({
                    where: { email_user },
                    data: { beban_bimbingan: parseInt(beban_bimbingan) },
                });
            }
        }

        // Kirim status sukses ke EJS
        const dosenList = await prismaClient.user.findMany({
            where: {
                role: 'DOSEN',
            },
        });
        res.render('admin/monitoring-beban', {
            dosenList,
            status: 'success',  // Status berhasil
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi Kesalahan Internal');
    }
};
