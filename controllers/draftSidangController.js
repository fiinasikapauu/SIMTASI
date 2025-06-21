const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /draftsidang  → tampilkan tabel
exports.list = async (req, res) => {
  try {
    // ambil semua draft yang sudah di-upload
    const drafts = await prisma.sidang_ta.findMany({
      orderBy: { tanggal_daftar: "desc" },
      include: {
        user: { select: { nama: true, nomorInduk: true } } // join ke tabel user
      }
    });

    res.render("dosen/draftSidang", { drafts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server.");
  }
};

// GET /draftsidang/view/:id  → kirim file pdf
exports.viewPdf = async (req, res) => {
  const { id } = req.params;

  try {
    const draft = await prisma.sidang_ta.findUnique({
      where: { id_sidang: Number(id) }
    });

    if (!draft) return res.status(404).send("Draft tidak ditemukan.");

    // lokasi file di server
    const filePath = path.join(__dirname, "..", "uploads", "laporan_kemajuan", draft.file_draft_sidang);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Gagal membuka file.");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server.");
  }
};
