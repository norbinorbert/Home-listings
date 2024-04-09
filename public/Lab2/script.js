document.getElementById('form').addEventListener('submit', (event) => {
  const submitButton = document.getElementById('submit');
  const formElements = document.getElementsByTagName('input');
  if (submitButton.textContent == 'Start game') {
    submitButton.textContent = 'Restart';
    for (i = 0; i < formElements.length; i++) {
      formElements[i].disabled = true;
    }
  } else {
    submitButton.textContent = 'Start game';
    for (i = 0; i < formElements.length; i++) {
      formElements[i].disabled = false;
    }
  }
  event.preventDefault();
});
