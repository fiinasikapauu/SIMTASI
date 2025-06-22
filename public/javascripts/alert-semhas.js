document.querySelectorAll('.btn-setuju').forEach(button => {
  button.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');  // Ambil id dari button
    // Menampilkan konfirmasi sebelum melanjutkan
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda akan menyetujui draft ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Setujui!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/validasidraftsemhas/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'disetujui' })  // Kirim status disetujui
          });

          const result = await response.json();
          if (result.success) {
            // Tampilkan alert sukses dan biarkan tetap tampil sampai tombol OK diklik
            Swal.fire({
              title: 'Sukses',
              text: result.message,
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              location.reload();  // Refresh page to show updated status
            });
          } else {
            Swal.fire({
              title: 'Gagal',
              text: result.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } catch (err) {
          Swal.fire({
            title: 'Gagal',
            text: 'Terjadi kesalahan server',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  });
});

document.querySelectorAll('.btn-tolak').forEach(button => {
  button.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');  // Ambil id dari button
    // Menampilkan konfirmasi sebelum melanjutkan
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda akan menolak draft ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Tolak!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/validasidraftsemhas/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'ditolak' })  // Kirim status ditolak
          });

          const result = await response.json();
          if (result.success) {
            // Tampilkan alert sukses dan biarkan tetap tampil sampai tombol OK diklik
            Swal.fire({
              title: 'Sukses',
              text: result.message,
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              location.reload();  // Refresh page to show updated status
            });
          } else {
            Swal.fire({
              title: 'Gagal',
              text: result.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } catch (err) {
          Swal.fire({
            title: 'Gagal',
            text: 'Terjadi kesalahan server',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  });
});
