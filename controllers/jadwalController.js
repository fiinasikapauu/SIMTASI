const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.form = (req, res) => {
  res.render("admin/jadwal");
};

exports.create = async (req, res) => {
  const { jenis_jadwal, tanggal, waktu } = req.body;
  const admin_id = req.session.user.email;

  try {
    const tanggalJadwal = new Date(tanggal);
    const waktuJadwal = new Date(`${tanggal}T${waktu}`);

    await prisma.jadwal_sidang_seminar.create({
      data: {
        jenis_jadwal,
        tanggal: tanggalJadwal,
        waktu: waktuJadwal,
        admin_id
      }
    });

    res.send(`
      <script>
        alert("Jadwal berhasil disimpan!");
        window.location.href = "/jadwal";
      </script>
    `);
  } catch (err) {
    console.error(err);
    res.send(`
      <script>
        alert("Gagal menyimpan jadwal: ${err.message}");
        window.location.href = "/jadwal";
      </script>
    `);
  }
};
