const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.saveSidangDate = async (req, res) => {
    try {
        // Ambil data dari request body
        const { tanggal, jenis_sidang, email_user } = req.body;

        // Periksa apakah semua data sudah ada
        if (!tanggal || !jenis_sidang || !email_user) {
            return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }

        // Menyimpan tanggal sidang ke dalam database menggunakan Prisma
        const newSidang = await prisma.kalenderSidang.create({
            data: {
                email_user: email_user,      // Email pengguna
                tanggal: new Date(tanggal),  // Tanggal yang dipilih
                jenis_sidang: jenis_sidang,  // Jenis sidang, misalnya "TA"
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

        // Hapus data sidang berdasarkan tanggal
        const deletedSidang = await prisma.kalenderSidang.delete({
            where: {
                tanggal: new Date(tanggal),
            },
        });

        return res.status(200).json({ success: true, sidang: deletedSidang });
    } catch (error) {
        console.error('Error clearing sidang date:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
};