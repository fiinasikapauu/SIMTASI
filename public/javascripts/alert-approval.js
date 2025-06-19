// Menggunakan SweetAlert untuk konfirmasi
document.querySelectorAll('.approvalBtn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const idPendaftaran = event.target.getAttribute('data-id');
        const statusApproval = event.target.getAttribute('data-status');
        
        try {
            const response = await fetch(`/approvaldospem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approvalData: [
                        {
                            id_pendaftaran: idPendaftaran,
                            status_approval: statusApproval
                        }
                    ]
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Tampilkan SweetAlert dengan pesan sukses
                Swal.fire({
                    title: 'Berhasil!',
                    text: `Status persetujuan untuk mahasiswa ini telah diubah menjadi ${statusApproval}`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Reload halaman untuk menampilkan perubahan
                    window.location.reload();
                });
            } else {
                throw new Error('Gagal memperbarui status');
            }
        } catch (error) {
            // Menampilkan SweetAlert error jika gagal
            Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat memperbarui status persetujuan',
                icon: 'error',
                confirmButtonText: 'Coba Lagi'
            });
        }
    });
});
