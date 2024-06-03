// redirects user to the selected conversation when button is clicked
window.onload = () => {
  const button = document.getElementById('redirect-to');
  const select = document.getElementById('user');

  button.addEventListener('click', () => {
    window.location.href = `/messages/${select.value}`;
  });
};
