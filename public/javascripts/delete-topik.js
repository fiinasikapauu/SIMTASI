// Menambahkan event listener ke tombol hapus
document.addEventListener("DOMContentLoaded", function() {
  // Ambil semua tombol dengan kelas 'deleteBtn'
  const deleteButtons = document.querySelectorAll('.deleteBtn');
  
  // Tambahkan event listener ke setiap tombol
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Ambil id_topikta dari data-id tombol
      const id_topikta = button.dataset.id;
      
      // Tanyakan konfirmasi sebelum menghapus
      if (confirm("Apakah Anda yakin ingin menghapus topik ini?")) {
        // Lakukan penghapusan melalui fetch atau API lainnya
        fetch(`/daftartopiktersedia/${id_topikta}`, {
          method: 'DELETE', // Gunakan metode DELETE
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert("Topik berhasil dihapus!");
            location.reload(); // Reload halaman setelah data dihapus
          } else {
            alert("Gagal menghapus topik.");
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert("Terjadi kesalahan saat menghapus topik.");
        });
      }
    });
  });
});
