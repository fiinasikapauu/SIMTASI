const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /draftsidang  → Tampilkan tabel untuk Dosen
const list = async (req, res) => {
  try {
    const drafts = await prisma.draft_sidang.findMany({
      where: {
        user: {
          is: { 
            email_user: { not: undefined } 
          }
        },
      },
      orderBy: { tgl_upload: "desc" },
      include: {
        user: { select: { nama: true, nomorInduk: true } },
      },
    });
    res.render("dosen/draftSidang", { drafts });
  } catch (err) {
    console.error("Error fetching draft sidang:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server", error: err.message });
  }
};

// GET /draftsidang/view/:id  → Kirim file PDF untuk dilihat Dosen
const viewPdf = async (req, res) => {
  const { id } = req.params;
  try {
    const draft = await prisma.draft_sidang.findUnique({
      where: { id_draftsidang: Number(id) },
    });

    if (!draft) {
      return res.status(404).send("Draft tidak ditemukan.");
    }

    const filePath = path.join(__dirname, "..", "uploads", "draftsidang", draft.file_draft_sidang);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Gagal mengirim file:", err);
        res.status(500).send("Gagal membuka file.");
      }
    });
  } catch (err) {
    console.error("Error viewing PDF:", err);
    res.status(500).send("Terjadi kesalahan server saat membuka file.");
  }
};

module.exports = {
  list,
  viewPdf,
};