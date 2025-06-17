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

