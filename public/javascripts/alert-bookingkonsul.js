 // Menangani form submission
  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah halaman melakukan reload otomatis

    const dosen = document.getElementById('dosen').value;
    const tanggal = document.getElementById('tanggal').value;
    const waktu = document.getElementById('waktu').value;

    // Mengirim data ke server menggunakan fetch API
    fetch('/bookingkonsul', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `dosen=${dosen}&tanggal=${tanggal}&waktu=${waktu}`,
    })
    .then(response => response.json())  // Pastikan respons dalam format JSON
    .then(data => {
      if (data.success) {
        // Menampilkan SweetAlert jika booking berhasil
        Swal.fire({
          icon: 'success',
          title: 'Booking Sesi Konsultasi Berhasil',
          text: data.message, // Menampilkan pesan sukses dari server
        });
      } else {
        // Menampilkan SweetAlert jika terjadi error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message, // Menampilkan pesan error dari server
        });
      }
    })
    .catch(error => {
      // Menampilkan SweetAlert jika terjadi error pada fetch
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat melakukan booking.',
      });
    });
  });

