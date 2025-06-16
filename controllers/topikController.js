// controllers/topikController.js
const prisma = require('../middleware/auth');

const addTopik = async (req, res) => {
  const { topik, dosen } = req.body;

  try {
    const newTopik = await prisma.topikTA.create({
      data: {
        topik: topik,
        dosen: dosen,
      },
    });

    res.status(201).send('Data berhasil disimpan!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan saat menyimpan data');
  }
};

module.exports = {
  addTopik,
};
