const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*  GET /sidang/pemberian-nilai  */
exports.list = async (req, res) => {
  try {
    const records = await prisma.sidang_ta.findMany({
      include: {
        user: { select: { nama: true, nomorInduk: true } }
      },
      orderBy: { user: { nama: "asc" } }
    });

    res.render("dosen/pemberianNilai", { records });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server.");
  }
};

/*  POST /sidang/pemberian-nilai/:id  */
exports.update = async (req, res) => {
  const { id }   = req.params;
  const nilaiRaw = req.body.nilai;
  const nilai    = parseFloat(nilaiRaw);

  if (isNaN(nilai) || nilai < 0 || nilai > 100) {
    return res.status(400).send("Nilai tidak valid (0 – 100).");
  }

  try {
    await prisma.sidang_ta.update({
      where: { id_sidang: Number(id) },
      data:  { nilai_akhir: nilai }
    });

    /* redirect + query utk SweetAlert */
    res.redirect("/sidang/pemberian-nilai?sukses=true");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menyimpan nilai.");
  }
};
