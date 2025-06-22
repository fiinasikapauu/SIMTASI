document.querySelectorAll('.btn-setuju').forEach(button => {
  button.addEventListener('click', async (e) => {
    const id = button.dataset.id;  // Lebih aman pakai .dataset
    if (!id) return;

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
          const response = await fetch(`/validasidraftsidang/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'disetujui' })
          });

          const result = await response.json();

          if (result.success) {
            await Swal.fire({
              title: 'Sukses',
              text: result.message,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            location.reload();
          } else {
            Swal.fire({
              title: 'Gagal',
              text: result.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } catch (err) {
          console.error(err);
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
    const id = button.dataset.id;
    if (!id) return;

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
          const response = await fetch(`/validasidraftsidang/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ditolak' })
          });

          const result = await response.json();

          if (result.success) {
            await Swal.fire({
              title: 'Sukses',
              text: result.message,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            location.reload();
          } else {
            Swal.fire({
              title: 'Gagal',
              text: result.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } catch (err) {
          console.error(err);
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
