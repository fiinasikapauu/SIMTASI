const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDraftSemhas = async (req, res) => {
    try {
      // Ambil email user dari session
      const emailUser = req.session.user?.email;
      
      if (!emailUser) {
        return res.status(401).json({
          success: false,
          message: 'User tidak terautentikasi'
        });
      }
  
      // Cek apakah file ada
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File draft seminar hasil harus diupload'
        });
      }
  
      // Simpan data ke database
      const newDraftSemhas = await prisma.seminar_hasil.create({
        data: {
          email_user: emailUser,
          file_draft: req.file.filename,
          tanggal_daftar: new Date(),
          status: 'Menunggu Review',
          jadwal: '-'
        }
      });
  
      res.json({
        success: true,
        message: 'Draft seminar hasil berhasil diupload',
        data: newDraftSemhas
      });
  
    } catch (error) {
      console.error('Error uploading draft seminar hasil:', error, req.file, req.session.user);
      
      // Hapus file jika terjadi error
      if (req.file) {
        const filePath = path.join('uploads/draftsemhas/', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
  
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengupload draft seminar hasil',
        error: error.message
      });
    }
  };