const { PrismaClient } = require('@prisma/client');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const prisma = new PrismaClient();

// Fungsi helper untuk mengambil dan memformat data peserta
async function getPesertaData() {
  const semhas = await prisma.pendaftaran_semhas.findMany({
    include: { user: true }
  });
  const sidang = await prisma.sidang_ta.findMany({
    include: { user: true }
  });

  const peserta = [
    ...semhas.map(item => ({
      nama: item.user?.nama || '-',
      nim: item.user?.nomorInduk || '-',
      tanggal_daftar: item.waktu_pendaftaran?.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) || '-',
      tanggal_daftar_raw: item.waktu_pendaftaran,
      jenis_kegiatan: 'Seminar Hasil'
    })),
    ...sidang.map(item => ({
      nama: item.user?.nama || '-',
      nim: item.user?.nomorInduk || '-',
      tanggal_daftar: item.tanggal_daftar?.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) || '-',
      tanggal_daftar_raw: item.tanggal_daftar,
      jenis_kegiatan: 'Sidang TA'
    }))
  ];

  // Gabungkan dan urutkan semua peserta berdasarkan tanggal
  peserta.sort((a, b) => {
    const dateA = a.tanggal_daftar_raw ? new Date(a.tanggal_daftar_raw) : new Date(0);
    const dateB = b.tanggal_daftar_raw ? new Date(b.tanggal_daftar_raw) : new Date(0);
    return dateB - dateA;
  });
  
  return peserta;
}

// Tampilkan halaman daftar peserta
exports.getDaftarPeserta = async (req, res) => {
  try {
    const peserta = await getPesertaData();
    res.render('admin/daftarPeserta', { 
      peserta,
      user: req.session.user 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server');
  }
};

// Download PDF daftar peserta
exports.downloadPDF = async (req, res) => {
  try {
    const pesertaData = await getPesertaData();

    // Ubah data menjadi format yang dibutuhkan oleh pdfmake
    const tableBody = [
      ['Nama', 'NIM', 'Tanggal Daftar', 'Jenis Kegiatan'],
      ...pesertaData.map(p => [p.nama, p.nim, p.tanggal_daftar, p.jenis_kegiatan])
    ];

    const docDefinition = {
      content: [
        { text: 'Daftar Peserta Semhas/Sidang', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', '*'],
            body: tableBody
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#E2E8F0' : null;
            }
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true }
      }
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer(buffer => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="daftar-peserta-semhas-sidang.pdf"');
      res.end(buffer);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal membuat PDF');
  }
};