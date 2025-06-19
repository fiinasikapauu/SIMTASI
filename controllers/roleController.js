const { PrismaClient, user_role } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users and their roles
exports.getRoles = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                email_user: true,
                role: true
            }
        });
        res.render('admin/roles', { users });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

// Edit user role
exports.editRole = async (req, res) => {
    const id = decodeURIComponent(req.params.id);  // Mengambil email_user dan mendekodekannya
    const { role } = req.body;  // Role yang dipilih oleh admin

    // Memastikan role yang dimasukkan valid
    if (!Object.values(user_role).includes(role)) {
        return res.status(400).send('Invalid role');
    }

    try {
        await prisma.user.update({
            where: { email_user: id },
            data: { role: role },
        });

        res.redirect('/roles?message=editSuccess');
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

// Hapus user berdasarkan email_user
exports.deleteRole = async (req, res) => {
    const { email } = req.params;  // Mengambil email_user dari URL

    try {
        await prisma.user.delete({
            where: { email_user: email },
        });

        res.redirect('/roles?message=deleteSuccess');
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};
