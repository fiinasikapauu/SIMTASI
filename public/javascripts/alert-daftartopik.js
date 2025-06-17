// public/javascripts/alert.js
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');

  if (success === 'true') {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data berhasil disimpan!',
      confirmButtonText: 'OK'
    });
  }
});
