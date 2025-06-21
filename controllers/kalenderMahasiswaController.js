const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getKalenderPage: async (req, res) => {
        try {
            // Fetch kalender sidang data from the database
            const kalender = await prisma.kalender_sidang.findMany({
                orderBy: {
                    tanggal: 'asc'
                }
            });

            // Render the kalender view and pass the data to the EJS template
            res.render('mahasiswa/kalender', { kalender });
        } catch (error) {
            console.error("Error fetching calendar data:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};