const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { nama, nomor_induk, email, password } = req.body;
  const role = "MAHASISWA"; // Sesuaikan dengan role yang diinginkan

  try {
    // Cek apakah email sudah terdaftar
    const userExists = await prisma.user.findUnique({
      where: { email: email }
    });

    if (userExists) {
      return res.send(`
        <script>
            alert('Email sudah terdaftar');
            window.location.href = '/signup';
        </script>
      `);
    }

    // Hash password sebelum disimpan
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Menyimpan data pengguna baru
    const newUser = await prisma.user.create({
      data: {
        nama,
        nomorInduk: nomor_induk,
        email,
        password: hashedPassword,
        role: role
      }
    });

    // Mengarahkan pengguna ke halaman login setelah berhasil mendaftar
    return res.send(`
      <script>
          alert('Akun berhasil dibuat, silakan login');
          window.location.href = '/signin';
      </script>
    `);

  } catch (err) {
    return res.send(`
      <script>
          alert('Gagal daftar: ${err.message}');
          window.location.href = '/signup';
      </script>
    `);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari pengguna berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.send(`
        <script>
            alert('Email tidak ditemukan!');
            window.location.href = '/signin';
        </script>
      `);
    }

    // Bandingkan password yang dimasukkan dengan password yang disimpan di database
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.send(`
        <script>
            alert('Password salah!');
            window.location.href = '/signin';
        </script>
      `);
    }

    // Simpan data user di session
    req.session.user = {
      email: user.email,
      nama: user.nama,
      role: user.role
    };

    // Redirect sesuai dengan role
    switch (user.role) {
      case "MAHASISWA":
        return res.redirect("/homemahasiswa");
      case "DOSEN":
        return res.redirect("/homedosen");
      case "ADMIN":
        return res.redirect("/homeadmin");
      default:
        return res.send(`
          <script>
              alert('Role tidak dikenali!');
              window.location.href = '/signin';
          </script>
        `);
    }
  } catch (err) {
    return res.send(`
      <script>
          alert('Terjadi kesalahan server: ${err.message}');
          window.location.href = '/signin';
      </script>
    `);
  }
};
