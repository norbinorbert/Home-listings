const submitButton = document.getElementById('submit');
const formElements = document.getElementsByTagName('input');
const canvas = document.getElementById('canvas');
const canvasContent = canvas.getContext('2d');
const maxNumber = 100;
const rectangleWidth = 100;
const rectangleHeight = 50;
const leftRectangleXCoordinate = 0;
const rightRectangleXCoordinate = 150;
let rectangleYCoordinates = [10];
let problems = [];
let orderedAnswers = [];
const problemXCoordinate = 20;
const answerXCoordinate = 190;
let problemYCoordinates = [40];
let isProblemSelected = false;
let doneProblems = [];
let doneAnswers = [];
let lastClickedProblemIndex = -1;
let lastClickedAnswerIndex = -1;
let linesDrawn = [];

//game starts when the "Start game" button is pressed
function startGame() {
  submitButton.textContent = 'Restart';

  //check which operators were selected
  let listOfOperators = [];
  for (i = 0; i < formElements.length; i++) {
    formElements[i].disabled = true;
    if (formElements[i].type == 'checkbox' && formElements[i].checked) {
      listOfOperators.push(document.querySelector(`label[for="${formElements[i].id}"]`).textContent);
    }
  }

  //generate the problems and draw them in rectangles
  const numberOfProblems = parseInt(document.getElementById('number-of-problems').value);
  let drawnAnswers = [];
  let answers = [];
  for (i = 0; i < numberOfProblems; i++) {
    let number1 = Math.floor(Math.random() * maxNumber + 1);
    let number2 = Math.floor(Math.random() * maxNumber + 1);
    let operatorIndex = Math.floor(Math.random() * listOfOperators.length);
    let operator = listOfOperators[operatorIndex];
    let answer = eval(number1 + operator + number2);
    canvasContent.font = '20px Times New Roman';
    problems.push(`${number1} ${operator} ${number2}`);
    answers.push(answer);
    canvasContent.fillStyle = '#00FFFF';
    canvasContent.fillRect(leftRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(problems[i], problemXCoordinate, problemYCoordinates[i]);
    rectangleYCoordinates.push(rectangleYCoordinates[i] + rectangleHeight + 1);
    problemYCoordinates.push(problemYCoordinates[i] + rectangleHeight + 1);
    drawnAnswers.push(false);
    doneProblems.push(false);
    doneAnswers.push(false);
  }

  //draw the answers in random order
  for (i = 0; i < numberOfProblems; i++) {
    let answerIndex = Math.floor(Math.random() * answers.length);
    while (drawnAnswers[answerIndex]) {
      answerIndex = Math.floor(Math.random() * answers.length);
    }
    drawnAnswers[answerIndex] = true;
    orderedAnswers.push(answers[answerIndex]);
    canvasContent.fillStyle = '#00FFFF';
    canvasContent.fillRect(rightRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(answers[answerIndex], answerXCoordinate, problemYCoordinates[i]);
  }

  //we will have 1 extra coordinate at the end, remove it
  rectangleYCoordinates.pop();
  problemYCoordinates.pop();
}

//game restarts when the "Restart" button is pressed
function restartGame() {
  submitButton.textContent = 'Start game';

  //clear every input
  for (i = 0; i < formElements.length; i++) {
    formElements[i].disabled = false;
    if (formElements[i].type == 'checkbox') {
      formElements[i].checked = false;
    } else {
      formElements[i].value = null;
    }
  }
  //clear canvas
  canvasContent.clearRect(0, 0, canvas.width, canvas.height);

  //reset arrays and variables
  isProblemSelected = false;
  rectangleYCoordinates = [10];
  problemYCoordinates = [30];
  problems = [];
  answers = [];
  orderedAnswers = [];
  doneProblems = [];
  doneAnswers = [];
  lastClickedProblemIndex = -1;
  lastClickedAnswerIndex = -1;
}

//checks when the submit button is pressed
document.getElementById('form').addEventListener('submit', (event) => {
  if (submitButton.textContent == 'Start game') {
    startGame();
  } else {
    restartGame();
  }
  event.preventDefault();
});

//checks if a point is inside a rectangle
function isPointInsideRectangle(pointX, pointY, rectangleX, rectangleY) {
  return (
    rectangleX <= pointX &&
    rectangleX + rectangleWidth >= pointX &&
    rectangleY <= pointY &&
    rectangleY + rectangleHeight >= pointY
  );
}

//checks when the user clicks on the canvas
//if they clicked a problem/answer, it will get "selected"
canvas.addEventListener('click', (event) => {
  let canvasBounds = canvas.getBoundingClientRect();
  let mouseX = event.clientX - canvasBounds.left;
  let mouseY = event.clientY - canvasBounds.top;
  for (i = 0; i < rectangleYCoordinates.length; i++) {
    //first the user needs to click on a problem
    if (!isProblemSelected && !doneProblems[i]) {
      if (isPointInsideRectangle(mouseX, mouseY, leftRectangleXCoordinate, rectangleYCoordinates[i])) {
        canvasContent.fillStyle = '#FFFF00';
        canvasContent.fillRect(leftRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
        canvasContent.fillStyle = '#000000';
        canvasContent.fillText(problems[i], problemXCoordinate, problemYCoordinates[i]);
        isProblemSelected = true;
        doneProblems[i] = true;
        lastClickedProblemIndex = i;
        break;
      }
      //only after clicking the problem can the user click an answer
    } else if (isProblemSelected && !doneAnswers[i]) {
      if (isPointInsideRectangle(mouseX, mouseY, rightRectangleXCoordinate, rectangleYCoordinates[i])) {
        canvasContent.fillStyle = '#FFFF00';
        canvasContent.fillRect(rightRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
        canvasContent.fillStyle = '#000000';
        canvasContent.fillText(orderedAnswers[i], answerXCoordinate, problemYCoordinates[i]);
        isProblemSelected = false;
        doneAnswers[i] = true;
        lastClickedAnswerIndex = i;

        //drawing a line from the problem to the answer
        canvasContent.fillStyle = '#000000';
        canvasContent.beginPath();
        canvasContent.moveTo(
          leftRectangleXCoordinate + rectangleWidth,
          rectangleYCoordinates[lastClickedProblemIndex] + rectangleHeight / 2,
        );
        canvasContent.lineTo(
          rightRectangleXCoordinate,
          rectangleYCoordinates[lastClickedAnswerIndex] + rectangleHeight / 2,
        );
        canvasContent.stroke();

        //storing the indexes for answer validation
        let isCorrect = eval(problems[lastClickedProblemIndex]) == orderedAnswers[lastClickedAnswerIndex];
        linesDrawn.push([lastClickedProblemIndex, lastClickedAnswerIndex, isCorrect]);
        break;
      }
    }
  }
});
