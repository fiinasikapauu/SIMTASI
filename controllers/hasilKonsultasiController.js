const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Fungsi untuk menampilkan halaman Hasil Konsultasi
exports.getHasilKonsultasi = async (req, res) => {
    try {
        // Ambil data dari database berdasarkan user yang login
        const userEmail = req.session.user.email; // Ambil email user yang sudah login
        const konsultasi = await prisma.konsultasi.findFirst({
            where: {
                email_user: userEmail
            },
            include: {
                user: true, // Untuk mendapatkan nama lengkap dari user
            }
        });

        if (!konsultasi) {
            return res.status(404).send('Konsultasi tidak ditemukan');
        }

        const { nama } = konsultasi.user;
        const { tanggal_konsultasi, dosen_pembimbing } = konsultasi;

        // Cek apakah ada feedback yang terkait dengan email_user
        const feedback = await prisma.feedback.findFirst({
            where: {
                email_user: userEmail
            }
        });

        if (!feedback) {
            return res.status(404).send('Feedback tidak ditemukan');
        }

        const { feedback_text, topik_konsultasi } = feedback;

        // Render halaman hasil konsultasi dengan data yang diambil
        res.render('mahasiswa/hasilKonsultasi', {
            nama,
            dosen_pembimbing,
            tanggal_konsultasi,
            feedback_text,
            topik_konsultasi
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan');
    }
};

// Fungsi untuk menggenerate PDF laporan hasil konsultasi
exports.generatePDF = async (req, res) => {
    try {
        const userEmail = req.session.user.email;

        // Ambil data konsultasi berdasarkan user yang login
        const konsultasi = await prisma.konsultasi.findFirst({
            where: {
                email_user: userEmail
            },
            include: {
                user: true,
            }
        });

        if (!konsultasi) {
            return res.status(404).send('Konsultasi tidak ditemukan');
        }

        const { nama } = konsultasi.user;
        const { tanggal_konsultasi, dosen_pembimbing } = konsultasi;

        // Cari feedback berdasarkan email_user (tanpa pembatasan tanggal)
        const feedback = await prisma.feedback.findFirst({
            where: {
                email_user: userEmail // Cek feedback hanya berdasarkan email
            }
        });

        if (!feedback) {
            return res.status(404).send('Feedback tidak ditemukan');
        }

        const { feedback_text, topik_konsultasi } = feedback;

        // Membuat file PDF dengan desain yang lebih menarik
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });
        const filePath = path.join(__dirname, 'hasil_konsultasi.pdf');
        doc.pipe(fs.createWriteStream(filePath));

        // HEADER DESIGN
        doc.fillColor('#ffffff').rect(0, 0, 595, 100).fill('#4CAF50'); // Set background color for header
        doc.fillColor('#ffffff').fontSize(24).text('Laporan Hasil Konsultasi', {
            align: 'center',
            underline: true,
            continued: false
        });
        doc.moveDown();
        doc.fillColor('#ffffff').fontSize(12).text('SIMTASI - Sistem Informasi Tugas Akhir', {
            align: 'center'
        });
        doc.moveDown(2); // Add extra space after header

        // BODY CONTENT DESIGN
        doc.fillColor('#000000').fontSize(12);

        // Tampilkan Nama Lengkap
        doc.text(`Nama Lengkap:`, { continued: true }).font('Helvetica-Bold').text(nama);
        doc.moveDown();

        // Tampilkan Dosen Pembimbing
        doc.text(`Dosen Pembimbing:`, { continued: true }).font('Helvetica-Bold').text(dosen_pembimbing);
        doc.moveDown();

        // Tampilkan Tanggal Konsultasi
        doc.text(`Tanggal Konsultasi:`, { continued: true }).font('Helvetica-Bold').text(tanggal_konsultasi);
        doc.moveDown();

        // Tampilkan Topik Konsultasi
        doc.text(`Topik Konsultasi:`, { continued: true }).font('Helvetica-Bold').text(topik_konsultasi);
        doc.moveDown();

        // Tampilkan Feedback Dosen
        doc.text(`Feedback Dosen:`, { continued: true }).font('Helvetica-Bold').text(feedback_text);
        doc.moveDown(2);

        // Add Divider Line
        doc.strokeColor('#4CAF50').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(2); // Add space after line

        // FOOTER DESIGN
        doc.fillColor('#4CAF50').fontSize(10).text('Sistem Informasi - Fakultas Teknologi Informasi', {
            align: 'center'
        });

        // Memastikan Footer berada di bagian bawah halaman
        const footerHeight = 30; // Tinggi footer
        if (doc.y < doc.page.height - footerHeight) {
            doc.moveDown(doc.page.height - doc.y - footerHeight); // Pindahkan dokumen jika perlu
        }
        doc.fillColor('#4CAF50').fontSize(10).text('Sistem Informasi - Fakultas Teknologi Informasi', {
            align: 'center'
        });

        doc.end();

        // Mengirimkan file PDF untuk diunduh
        doc.on('finish', () => {
            console.log("PDF selesai dibuat, mengirimkan ke user...");
            res.setHeader('Content-Disposition', 'attachment; filename=hasil_konsultasi.pdf');
            res.setHeader('Content-Type', 'application/pdf');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

            // Hapus file setelah dikirim
            fileStream.on('end', () => {
                fs.unlinkSync(filePath);
            });
        });

    } catch (error) {
        console.error("Terjadi kesalahan saat membuat PDF:", error);
        res.status(500).send('Terjadi kesalahan saat membuat PDF');
    }
};