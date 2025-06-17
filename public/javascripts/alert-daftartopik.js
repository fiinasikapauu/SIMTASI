// public/javascripts/alert.js
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const message = urlParams.get('message');

  if (success === 'true') {
    // Menampilkan alert sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: message || 'Data berhasil disimpan!',
      confirmButtonText: 'OK'
    });
  } else if (success === 'false') {
    // Menampilkan alert error
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: message || 'Terjadi kesalahan',
      confirmButtonText: 'OK'
    });
  }
});
