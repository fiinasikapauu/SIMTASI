const express = require("express");
const router = express.Router();

// Data untuk kalender sidang TA
const sidangData = [
  { tanggal: '10 Juni 2025', jenisSidang: 'Sidang Proposal' },
  { tanggal: '25 Juli 2024', jenisSidang: 'Sidang Proposal' },
  { tanggal: '5 Oktober 2024', jenisSidang: 'Sidang Proposal' },
  { tanggal: '20 November 2024', jenisSidang: 'Sidang Proposal' }
];

// Halaman untuk mahasiswa
router.get("/kalendersidang", (req, res) => {
  res.render("mahasiswa/kalendersidang", { user: req.session.user, sidangData: sidangData });
});
module.exports = router;