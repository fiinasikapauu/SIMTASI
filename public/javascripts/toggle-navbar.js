function toggleMenu(submenuId, arrowId) {
  const submenu = document.getElementById(submenuId);
  const arrow = document.getElementById(arrowId); // Ambil arrow berdasarkan ID yang diberikan

  if (submenu.classList.contains('collapse')) {
    submenu.classList.remove('collapse');
    arrow.classList.add('rotate-180');
  } else {
    submenu.classList.add('collapse');
    arrow.classList.remove('rotate-180');
  }
}

function setActiveMenu(menuId) {
  // Reset semua menu menjadi normal
  const allMenus = document.querySelectorAll('a');
  allMenus.forEach(menu => {
    menu.classList.remove('font-bold'); // Hilangkan bold dari semua menu
  });

  // Menambahkan kelas bold pada menu aktif
  const activeMenu = document.getElementById(menuId);
  activeMenu.classList.add('font-bold');
}

// Set bold pada menu Home saat pertama kali halaman dimuat
window.onload = function() {
  setActiveMenu('homeMenu');
};
