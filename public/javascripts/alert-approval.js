document.querySelectorAll('.approvalBtn').forEach((btn) => {
    btn.addEventListener('click', async (event) => {
        const approvalStatus = event.target.dataset.status;
        const idPendaftaran = event.target.dataset.id;

        // Menampilkan SweetAlert konfirmasi
        const swalResponse = await Swal.fire({
            title: `Apakah Anda yakin?`,
            text: `Anda akan mengubah status persetujuan menjadi ${approvalStatus}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal'
        });

        if (swalResponse.isConfirmed) {
            try {
                // Kirim request untuk update status persetujuan
                const response = await fetch(`/approvaldospem`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        approvalData: [
                            {
                                id_pendaftaran: idPendaftaran,
                                status_approval: approvalStatus,
                            }
                        ]
                    })
                });

                const result = await response.json();
                if (result.success) {
                    Swal.fire('Berhasil!', `Status persetujuan berhasil diperbarui menjadi ${approvalStatus}`, 'success');
                    location.reload(); // Reload untuk menampilkan data terbaru
                } else {
                    Swal.fire('Gagal!', `Terjadi kesalahan saat memperbarui status`, 'error');
                }
            } catch (error) {
                Swal.fire('Gagal!', `Terjadi kesalahan saat memperbarui status`, 'error');
            }
        }
    });
});
