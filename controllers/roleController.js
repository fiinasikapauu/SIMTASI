const { PrismaClient, user_role } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users and their roles
exports.getRoles = async (req, res) => {
    try {
        const users = await prisma.user.findMany(); // Get all users
        res.render('admin/roles', { users }); // Render from 'views/admin/roles.ejs'
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

// Edit user role
exports.editRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // Role can be 'ADMIN', 'MAHASISWA', 'DOSEN'
    
    // Ensure the role is valid according to the enum
    if (!Object.values(user_role).includes(role)) {
        return res.status(400).send('Invalid role');
    }

    try {
        await prisma.user.update({
            where: { email_user: id },
            data: { role: role },
        });
        res.redirect('/roles?message=editSuccess'); // Pastikan ada query string
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

// Hapus user berdasarkan email
exports.deleteRole = async (req, res) => {
    const { email } = req.params;  // Ambil email dari URL
    console.log(`Mencoba menghapus user dengan email: ${email}`);  // Log email yang akan dihapus
    
    try {
        await prisma.user.delete({
            where: { email_user: email }, // Hapus user berdasarkan email_user
        });
        res.redirect('/roles?message=deleteSuccess');  // Redirect dengan pesan sukses
    } catch (error) {
        console.log(error);
        res.status(500).send('Kesalahan Server');
    }
};
