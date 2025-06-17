const form = document.getElementById('topikForm');
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Simulate successful data input (you can replace this with an actual fetch or axios request)
    setTimeout(() => {
      // Show alert after submission
      const alertBox = document.getElementById('alert');
      alertBox.classList.remove('hidden');
      setTimeout(() => {
        alertBox.classList.add('hidden'); // Hide alert after 3 seconds
      }, 3000);
    }, 500);
  });