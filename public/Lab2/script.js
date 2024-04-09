document.getElementById('form').addEventListener('submit', (event) => {
  const submitButton = document.getElementById('submit');
  const formElements = document.getElementsByTagName('input');
  const canvas = document.getElementById('canvas');
  const canvasContent = canvas.getContext('2d');
  if (submitButton.textContent == 'Start game') {
    submitButton.textContent = 'Restart';
    let listOfOperators = [];
    for (i = 0; i < formElements.length; i++) {
      formElements[i].disabled = true;
      if (formElements[i].type == 'checkbox' && formElements[i].checked) {
        listOfOperators.push(document.querySelector(`label[for="${formElements[i].id}"]`).textContent);
      }
    }
    const numberOfProblems = parseInt(document.getElementById('number-of-problems').value);
    topLeftPoint = [0, 30];
    width = 100;
    height = 50;
    for (i = 0; i < numberOfProblems; i++) {
      let number1 = Math.floor(Math.random() * 100 + 1);
      let number2 = Math.floor(Math.random() * 100 + 1);
      let index = Math.floor(Math.random() * listOfOperators.length);
      let operator = listOfOperators[index];
      let answer = eval(number1 + operator + number2);
      canvasContent.font = '20px Times New Roman';
      canvasContent.fillText(`${number1} ${operator} ${number2}`, topLeftPoint[0], topLeftPoint[1]);
      topLeftPoint[1] += height + 1;
    }
  } else {
    submitButton.textContent = 'Start game';
    for (i = 0; i < formElements.length; i++) {
      formElements[i].disabled = false;
      if (formElements[i].type == 'checkbox') {
        formElements[i].checked = false;
      } else {
        formElements[i].textContent = '';
      }
    }
    canvasContent.clearRect(0, 0, canvas.width, canvas.height);
  }
  event.preventDefault();
});
