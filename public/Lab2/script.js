// html elements and variables that need them
let submitButton = null;
let formElements = null;
let canvas = null;
let canvasContent = null;
let leftRectangleXCoordinate = 0;
let rightRectangleXCoordinate = 0;
let problemTextXCoordinate = leftRectangleXCoordinate + 25;
let answerTextXCoordinate = rightRectangleXCoordinate + 25;

// global constants
const maxNumber = 100;
const rectangleWidth = 115;
const rectangleHeight = 50;

// global arrays
let rectangleYCoordinates = [10];
let textYCoordinates = [40];
let problems = [];
let doneProblems = [];
let lastClickedProblemIndex = -1;
let orderedAnswers = [];
let doneAnswers = [];
let lastClickedAnswerIndex = -1;
let isAProblemSelected = false;
let linesDrawn = [];

// game restarts when the "Restart" button is pressed
function restartGame() {
  submitButton.textContent = 'Start game';

  // clear every input
  for (let i = 0; i < formElements.length; i++) {
    formElements[i].disabled = false;
    if (formElements[i].type === 'checkbox') {
      formElements[i].checked = false;
    } else {
      formElements[i].value = null;
    }
  }
  // clear canvas
  canvasContent.clearRect(0, 0, canvas.width, canvas.height);

  // reset arrays and variables to their default values
  isAProblemSelected = false;
  rectangleYCoordinates = [10];
  textYCoordinates = [40];
  problems = [];
  orderedAnswers = [];
  doneProblems = [];
  doneAnswers = [];
  linesDrawn = [];
  lastClickedProblemIndex = -1;
  lastClickedAnswerIndex = -1;
}

// game starts when the "Start game" button is pressed
function startGame() {
  submitButton.textContent = 'Restart';

  let checkboxSelected = false;
  // check which operators were selected
  const listOfOperators = [];
  for (let i = 0; i < formElements.length; i++) {
    formElements[i].disabled = true;
    if (formElements[i].type === 'checkbox' && formElements[i].checked) {
      checkboxSelected = true;
      listOfOperators.push(document.querySelector(`label[for="${formElements[i].id}"]`).textContent);
    }
  }

  // if no operators were selected we restart the game
  if (!checkboxSelected) {
    window.alert('Please check at least one of the boxes');
    restartGame();
    return;
  }

  // generate the problems and draw them in rectangles
  const numberOfProblems = parseInt(document.getElementById('number-of-problems').value, 10);
  const drawnAnswers = [];
  const answers = [];
  for (let i = 0; i < numberOfProblems; i++) {
    // generating the problem and calculating the answer
    const number1 = Math.floor(Math.random() * maxNumber + 1);
    const number2 = Math.floor(Math.random() * maxNumber + 1);
    const operatorIndex = Math.floor(Math.random() * listOfOperators.length);
    const operator = listOfOperators[operatorIndex];
    const problem = `${number1} ${operator} ${number2}`;

    let answer = 0;
    switch (operator) {
      case '+':
        answer = (number1 + number2).toFixed(2);
        break;
      case '-':
        answer = (number1 - number2).toFixed(2);
        break;
      case '*':
        answer = (number1 * number2).toFixed(2);
        break;
      case '/':
        answer = (number1 / number2).toFixed(2);
        break;
      default:
        break;
    }

    canvasContent.font = '20px Arial';
    problems.push(problem);
    answers.push(answer);

    // drawing the problems in rectangles
    canvasContent.fillStyle = '#00FFFF';
    canvasContent.fillRect(leftRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(problems[i], problemTextXCoordinate, textYCoordinates[i]);

    // some helper arrays needed for later
    rectangleYCoordinates.push(rectangleYCoordinates[i] + rectangleHeight + 5);
    textYCoordinates.push(textYCoordinates[i] + rectangleHeight + 5);
    drawnAnswers.push(false);
    doneProblems.push(false);
    doneAnswers.push(false);
  }

  // draw the answers in random order
  for (let i = 0; i < numberOfProblems; i++) {
    // generating a random index until we get an answer not yet displayed
    let answerIndex = Math.floor(Math.random() * answers.length);
    while (drawnAnswers[answerIndex]) {
      answerIndex = Math.floor(Math.random() * answers.length);
    }
    drawnAnswers[answerIndex] = true;
    orderedAnswers.push(answers[answerIndex]);

    // drawing the answers in rectangles
    canvasContent.fillStyle = '#00FFFF';
    canvasContent.fillRect(rightRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(answers[answerIndex], answerTextXCoordinate, textYCoordinates[i]);
  }

  // we will have 1 extra coordinate at the end, remove it
  rectangleYCoordinates.pop();
  textYCoordinates.pop();
}

// checks if a point is inside a rectangle
function isPointInsideRectangle(pointX, pointY, rectangleX, rectangleY) {
  return (
    rectangleX <= pointX &&
    rectangleX + rectangleWidth >= pointX &&
    rectangleY <= pointY &&
    rectangleY + rectangleHeight >= pointY
  );
}

function checkIfGameEnd() {
  // game ends when all problems were paired with an answer
  for (let i = 0; i < doneAnswers.length; i++) {
    if (!doneAnswers[i]) {
      return;
    }
  }

  // validating the answers given
  for (let i = 0; i < linesDrawn.length; i++) {
    if (linesDrawn[i][2]) {
      // green if correct
      canvasContent.fillStyle = '#00FF00';
    } else {
      // red if incorrect
      canvasContent.fillStyle = '#FF0000';
    }
    // clear the old content
    canvasContent.clearRect(
      leftRectangleXCoordinate - canvasContent.lineWidth,
      rectangleYCoordinates[linesDrawn[i][0]] - canvasContent.lineWidth,
      rectangleWidth + 2 * canvasContent.lineWidth,
      rectangleHeight + 2 * canvasContent.lineWidth,
    );
    canvasContent.clearRect(
      rightRectangleXCoordinate - canvasContent.lineWidth,
      rectangleYCoordinates[linesDrawn[i][1]] - canvasContent.lineWidth,
      rectangleWidth + 2 * canvasContent.lineWidth,
      rectangleHeight + 2 * canvasContent.lineWidth,
    );

    // draw the new colored rectangles
    canvasContent.fillRect(
      leftRectangleXCoordinate,
      rectangleYCoordinates[linesDrawn[i][0]],
      rectangleWidth,
      rectangleHeight,
    );
    canvasContent.fillRect(
      rightRectangleXCoordinate,
      rectangleYCoordinates[linesDrawn[i][1]],
      rectangleWidth,
      rectangleHeight,
    );

    // add the text to them
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(problems[linesDrawn[i][0]], problemTextXCoordinate, textYCoordinates[linesDrawn[i][0]]);
    canvasContent.fillText(orderedAnswers[linesDrawn[i][1]], answerTextXCoordinate, textYCoordinates[linesDrawn[i][1]]);
  }
}

// when the user selects a problem it gets highlighted with a border
function SelectProblem(i) {
  // draw the border for the selected problem
  canvasContent.strokeStyle = '#000000';
  canvasContent.strokeRect(leftRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
  isAProblemSelected = true;
  doneProblems[i] = true;
  lastClickedProblemIndex = i;
}

// when the user selects an answer, the problem gets redrawn and a line appears between the 2 selections
function SelectAnswer(i) {
  isAProblemSelected = false;
  doneAnswers[i] = true;
  lastClickedAnswerIndex = i;

  // redrawing the problem rectangle without a border
  canvasContent.clearRect(
    leftRectangleXCoordinate - canvasContent.lineWidth,
    rectangleYCoordinates[lastClickedProblemIndex] - canvasContent.lineWidth,
    rectangleWidth + 2 * canvasContent.lineWidth,
    rectangleHeight + 2 * canvasContent.lineWidth,
  );

  canvasContent.fillStyle = '#00FFFF';
  canvasContent.fillRect(
    leftRectangleXCoordinate,
    rectangleYCoordinates[lastClickedProblemIndex],
    rectangleWidth,
    rectangleHeight,
  );

  canvasContent.fillStyle = '#000000';
  canvasContent.fillText(
    problems[lastClickedProblemIndex],
    problemTextXCoordinate,
    textYCoordinates[lastClickedProblemIndex],
  );

  // drawing a line from the problem to the answer
  canvasContent.fillStyle = '#000000';
  canvasContent.beginPath();
  canvasContent.moveTo(
    leftRectangleXCoordinate + rectangleWidth,
    rectangleYCoordinates[lastClickedProblemIndex] + rectangleHeight / 2,
  );
  canvasContent.lineTo(rightRectangleXCoordinate, rectangleYCoordinates[lastClickedAnswerIndex] + rectangleHeight / 2);
  canvasContent.stroke();
}

// evaluates if the pair given by the user is correct or not
function EvaluateAnswerGiven() {
  // evaluating the pair given
  let evaluatedProblem = 0;
  const splitArray = problems[lastClickedProblemIndex].split(' ');
  const number1 = parseInt(splitArray[0], 10);
  const operator = splitArray[1];
  const number2 = parseInt(splitArray[2], 10);
  switch (operator) {
    case '+':
      evaluatedProblem = (number1 + number2).toFixed(2);
      break;
    case '-':
      evaluatedProblem = (number1 - number2).toFixed(2);
      break;
    case '*':
      evaluatedProblem = (number1 * number2).toFixed(2);
      break;
    case '/':
      evaluatedProblem = (number1 / number2).toFixed(2);
      break;
    default:
      break;
  }
  return evaluatedProblem === orderedAnswers[lastClickedAnswerIndex];
}

window.onload = () => {
  // html elements and constants that needed them
  submitButton = document.getElementById('submit');
  formElements = document.getElementsByTagName('input');
  canvas = document.getElementById('canvas');
  canvasContent = canvas.getContext('2d');

  leftRectangleXCoordinate = canvas.width / 2 - 1.5 * rectangleWidth;
  rightRectangleXCoordinate = canvas.width / 2 + 0.5 * rectangleWidth;

  problemTextXCoordinate = leftRectangleXCoordinate + 25;
  answerTextXCoordinate = rightRectangleXCoordinate + 25;

  // checks when the submit button is pressed
  document.getElementById('form').addEventListener('submit', (event) => {
    if (submitButton.textContent === 'Start game') {
      startGame();
    } else {
      restartGame();
    }
    event.preventDefault();
  });

  // checks when the user clicks on the canvas
  // if they clicked a problem/answer, it will get selected
  canvas.addEventListener('click', (event) => {
    // only draw if game has started
    if (submitButton.textContent === 'Restart') {
      const canvasBounds = canvas.getBoundingClientRect();
      const mouseX = event.clientX - canvasBounds.left;
      const mouseY = event.clientY - canvasBounds.top;
      for (let i = 0; i < rectangleYCoordinates.length; i++) {
        // first the user needs to click on a problem, then an answer
        if (
          !isAProblemSelected &&
          !doneProblems[i] &&
          isPointInsideRectangle(mouseX, mouseY, leftRectangleXCoordinate, rectangleYCoordinates[i])
        ) {
          SelectProblem(i);
          break;
        } else if (
          isAProblemSelected &&
          !doneAnswers[i] &&
          isPointInsideRectangle(mouseX, mouseY, rightRectangleXCoordinate, rectangleYCoordinates[i])
        ) {
          SelectAnswer(i);

          // storing the indexes for answer validation
          linesDrawn.push([lastClickedProblemIndex, lastClickedAnswerIndex, EvaluateAnswerGiven()]);
          break;
        }
      }
      checkIfGameEnd();
    }
  });
};
