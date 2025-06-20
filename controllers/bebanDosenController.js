const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bebanDosenController = {
    // Fungsi untuk menampilkan data dosen dan beban bimbingan
    async getBebanDosen(req, res) {
        try {
            const dosen = await prisma.user.findMany({
                where: {
                    role: 'DOSEN',
                },
            });

            res.render('admin/monitoring-beban', { dosen: dosen });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Fungsi untuk mengupdate beban bimbingan dosen
    async updateBebanDosen(req, res) {
        const { id } = req.params;
        const { beban_bimbingan } = req.body;

        try {
            await prisma.user.update({
                where: { email_user: id },
                data: { beban_bimbingan: parseInt(beban_bimbingan) },
            });

            res.redirect('/admin/monitoring-beban?success=true');
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // Fungsi untuk mengambil data monitoring beban dosen
    async getMonitoringBeban(req, res) {
        try {
            const dosen = await prisma.user.findMany({
                where: {
                    role: 'DOSEN',
                },
                select: {
                    email_user: true,
                    nama: true,
                    beban_bimbingan: true,
                },
            });

            res.json({ success: true, data: dosen });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Fungsi untuk memperbarui beban bimbingan dosen
    async updateBebanBimbingan(req, res) {
        const { email_user } = req.body;
        const { beban_bimbingan } = req.body;

        try {
            await prisma.user.update({
                where: { email_user: email_user },
                data: { beban_bimbingan: parseInt(beban_bimbingan) },
            });

            res.json({ success: true, message: 'Beban bimbingan berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = bebanDosenController;
