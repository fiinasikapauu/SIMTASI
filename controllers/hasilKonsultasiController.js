const { PrismaClient } = require('@prisma/client');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs');
const path = require('path');

// Mengatur font virtual (vfs) dari pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const prisma = new PrismaClient();

// Fungsi untuk menampilkan halaman Hasil Konsultasi
exports.getHasilKonsultasi = async (req, res) => {
    try {
        const userEmail = req.session.user.email;
        const konsultasi = await prisma.konsultasi.findFirst({
            where: { email_user: userEmail },
            include: { user: true },
        });

        if (!konsultasi) {
            return res.status(404).send('Konsultasi tidak ditemukan');
        }

        const { nama } = konsultasi.user;
        const { tanggal_konsultasi, dosen_pembimbing } = konsultasi;

        const feedback = await prisma.feedback.findFirst({
            where: { email_user: userEmail }
        });

        if (!feedback) {
            return res.status(404).send('Feedback tidak ditemukan');
        }

        const { feedback_text, topik_konsultasi } = feedback;

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

        const konsultasi = await prisma.konsultasi.findFirst({
            where: { email_user: userEmail },
            include: { user: true },
        });

        if (!konsultasi) {
            return res.status(404).send('Konsultasi tidak ditemukan');
        }

        const { nama } = konsultasi.user;
        const { tanggal_konsultasi, dosen_pembimbing } = konsultasi;

        // Format tanggal agar lebih mudah dibaca
        const formattedDate = new Date(tanggal_konsultasi).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const feedback = await prisma.feedback.findFirst({
            where: { email_user: userEmail }
        });

        if (!feedback) {
            return res.status(404).send('Feedback tidak ditemukan');
        }

        const { feedback_text, topik_konsultasi } = feedback;

        // Definisikan struktur dokumen PDF menggunakan pdfMake
        const docDefinition = {
            content: [
                // Header (Latar belakang penuh dari kiri ke kanan)
                {
                    text: 'Laporan Hasil Konsultasi',
                    alignment: 'center',
                    fontSize: 32,
                    bold: true,
                    color: '#FFFFFF', // Warna teks putih
                    background: '#81C784', // Warna latar belakang hijau muda
                    margin: [0, 20],
                    lineHeight: 1.5
                },
                {
                    text: 'SIMTASI - Sistem Informasi Tugas Akhir',
                    alignment: 'center',
                    fontSize: 14,
                    margin: [0, 10],
                    italics: true,
                    color: '#FFFFFF',
                    background: '#81C784', // Latar belakang header hijau muda
                    lineHeight: 1.5
                },

                // Tabel untuk Data
                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            ['Nama Lengkap:', nama],
                            ['Dosen Pembimbing:', dosen_pembimbing],
                            ['Tanggal Konsultasi:', formattedDate],
                            ['Topik Konsultasi:', topik_konsultasi],
                            ['Feedback Dosen:', feedback_text],
                        ]
                    },
                    layout: 'lightHorizontalLines', // Gaya tabel dengan garis horizontal
                    margin: [0, 20], // Menambahkan margin di antara tabel
                    style: 'tableStyle'
                },

                // Garis Pemisah
                {
                    text: '------------------------------------------------------',
                    alignment: 'center',
                    fontSize: 14,
                    color: '#555',
                    margin: [0, 10]
                },

                // Footer (Latar belakang penuh dari kiri ke kanan)
                {
                    text: 'Sistem Informasi - Fakultas Teknologi Informasi',
                    alignment: 'center',
                    fontSize: 10,
                    margin: [0, 20],
                    color: '#FFFFFF',
                    background: '#81C784', // Footer warna latar belakang hijau muda
                    lineHeight: 1.5
                }
            ],
            styles: {
                header: {
                    fontSize: 24,
                    bold: true,
                    alignment: 'center',
                    color: '#2C6B3F' // Warna hijau tua
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'left'
                },
                paragraph: {
                    fontSize: 12,
                    alignment: 'left',
                    color: '#333'
                },
                tableStyle: {
                    fontSize: 12,
                    alignment: 'left',
                    color: '#555',
                    margin: [0, 5],
                }
            },
            pageMargins: [30, 50, 30, 50], // Menambahkan margin pada halaman
            background: '#E8F5E9', // Latar belakang untuk seluruh halaman hijau muda
        };

        // Membuat PDF menggunakan pdfMake
        const pdfDoc = pdfMake.createPdf(docDefinition);

        // Mengambil buffer PDF dan mengirimkannya ke browser
        pdfDoc.getBuffer((buffer) => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Bukti-Konsultasi-${userEmail}.pdf"`);
            res.end(buffer); // Pastikan file benar-benar terkirim
        });

    } catch (error) {
        console.error("Terjadi kesalahan saat membuat PDF:", error);
        res.status(500).send('Terjadi kesalahan saat membuat PDF');
    }
};
