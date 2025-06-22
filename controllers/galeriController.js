const { PrismaClient, user_role } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller untuk menampilkan Galeri Judul TA yang Selesai
const getFinishedTA = async (req, res) => {
  try {
    // Query untuk mendapatkan mahasiswa yang sudah mendaftar sidang dan statusnya "selesai"
    const data = await prisma.pendaftaran_ta.findMany({
        where: {
        sidang_ta: { // Pastikan sidang_ta ada
        id_sidang: {},  // Pastikan sidang_ta ada (tidak null)
          }
      },
      include: {
        user: true,      // Mengambil data mahasiswa
        topikta:true,
        sidang_ta: true, // Mengambil data sidang TA (tanggal dan tahun selesai)
      },
    });

    // Menyaring data untuk menampilkan nama, judul TA, dosen pembimbing, dan tahun selesai
    const finishedTA = data.map(item => {
      return {
        nama: item.user.nama,
        judul_ta: item.judul_ta,
        dosen_pembimbing: item.topikta.dosen,  // Dosen pembimbing
        tahun_selesai: item.sidang_ta ? item.sidang_ta.jadwal.getFullYear() : 'TBD',  // Ambil tahun dari tanggal sidang
      };
    });

    // Render ke halaman EJS dengan data yang telah difilter
    res.render('admin/galeriJudulTA', { mahasiswaList: finishedTA });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data.');
  }
};

const PDFDocument = require('pdfkit');
const fs = require('fs');

const downloadPDF = async (req, res) => {
  try {
    const data = await prisma.pendaftaran_ta.findMany({
      where: {
        sidang_ta: { isNot: null }  // Hanya yang sudah ada sidang
      },
      include: {
        user: true,
        topikta: true,
        sidang_ta: true
      }
    });

    const doc = new PDFDocument({ margin: 30 });
    res.setHeader('Content-disposition', 'attachment; filename="galeri_judul_ta.pdf"');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    // Judul
    doc.fontSize(18).text('Galeri Judul TA yang Selesai', { align: 'center' });
    doc.moveDown(2);

    // Konfigurasi tabel
    const headers = ['No', 'Nama', 'Judul TA', 'Dosen Pembimbing', 'Tahun Selesai'];
    const columnWidths = [30, 100, 180, 140, 100];
    const startX = 50;
    let y = doc.y;

    const rowHeight = 25; // tinggi baris termasuk spacing

    // Fungsi menggambar border per sel
    const drawCellBorder = (x, y, width, height) => {
      doc.rect(x, y, width, height).stroke();
    };

    // Gambar header
    headers.forEach((header, i) => {
      const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.font('Helvetica-Bold')
         .fontSize(11)
         .text(header, x + 5, y + 7, {
           width: columnWidths[i] - 10,
           align: 'left'
         });
      drawCellBorder(x, y, columnWidths[i], rowHeight);
    });
    y += rowHeight;

    // Gambar isi tabel
    data.forEach((item, index) => {
      const row = [
        (index + 1).toString(),
        item.user.nama,
        item.judul_ta,
        item.topikta.dosen,
        item.sidang_ta?.jadwal.getFullYear().toString() || 'TBD'
      ];

      row.forEach((text, i) => {
        const x = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.font('Helvetica')
           .fontSize(10)
           .text(text, x + 5, y + 7, {
             width: columnWidths[i] - 10,
             align: 'left'
           });
        drawCellBorder(x, y, columnWidths[i], rowHeight);
      });

      y += rowHeight;

      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal generate PDF');
  }
};
module.exports = {
  getFinishedTA,
  downloadPDF
};
