function toggleVisibility() {
  const passwordField = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  // Toggle the type between 'password' and 'text'
  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.src = "/images/hide.png"; // Change to hide icon
  } else {
    passwordField.type = "password";
    eyeIcon.src = "/images/view.png"; // Change to view icon
  }
}

function validateForm(event) {
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm_password");

  if (!password || !confirm) return;

  if (password.value !== confirm.value) {
    alert("Password dan Konfirmasi Password tidak sama.");
    event.preventDefault();
  }
}