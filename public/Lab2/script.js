//html elements
const submitButton = document.getElementById('submit');
const formElements = document.getElementsByTagName('input');
const canvas = document.getElementById('canvas');
const canvasContent = canvas.getContext('2d');

//global constants
const maxNumber = 100;
const rectangleWidth = 100;
const rectangleHeight = 50;
const leftRectangleXCoordinate = 0;
const rightRectangleXCoordinate = 150;
const problemTextXCoordinate = 15;
const answerTextXCoordinate = 180;

//global arrays
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

//game starts when the "Start game" button is pressed
function startGame() {
  submitButton.textContent = 'Restart';

  let checkboxSelected = false;
  //check which operators were selected
  let listOfOperators = [];
  for (i = 0; i < formElements.length; i++) {
    formElements[i].disabled = true;
    if (formElements[i].type == 'checkbox' && formElements[i].checked) {
      checkboxSelected = true;
      listOfOperators.push(document.querySelector(`label[for="${formElements[i].id}"]`).textContent);
    }
  }

  //if no operators were selected we restart the game
  if (!checkboxSelected) {
    window.alert('Please check at least one of the boxes');
    restartGame();
    return;
  }

  //generate the problems and draw them in rectangles
  const numberOfProblems = parseInt(document.getElementById('number-of-problems').value);
  let drawnAnswers = [];
  let answers = [];
  for (i = 0; i < numberOfProblems; i++) {
    //generating the problem and calculating the answer
    let number1 = Math.floor(Math.random() * maxNumber + 1);
    let number2 = Math.floor(Math.random() * maxNumber + 1);
    let operatorIndex = Math.floor(Math.random() * listOfOperators.length);
    let operator = listOfOperators[operatorIndex];
    let problem = `${number1} ${operator} ${number2}`;
    let answer = eval(problem).toFixed(2);
    canvasContent.font = '20px Times New Roman';
    problems.push(problem);
    answers.push(answer);

    //drawing the problems in rectangles
    canvasContent.fillStyle = '#00FFFF';
    canvasContent.fillRect(leftRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(problems[i], problemTextXCoordinate, textYCoordinates[i]);

    //some helper arrays needed for later
    rectangleYCoordinates.push(rectangleYCoordinates[i] + rectangleHeight + 5);
    textYCoordinates.push(textYCoordinates[i] + rectangleHeight + 5);
    drawnAnswers.push(false);
    doneProblems.push(false);
    doneAnswers.push(false);
  }

  //draw the answers in random order
  for (i = 0; i < numberOfProblems; i++) {
    //generating a random index until we get an answer not yet displayed
    let answerIndex = Math.floor(Math.random() * answers.length);
    while (drawnAnswers[answerIndex]) {
      answerIndex = Math.floor(Math.random() * answers.length);
    }
    drawnAnswers[answerIndex] = true;
    orderedAnswers.push(answers[answerIndex]);

    //drawing the answers in rectangles
    canvasContent.fillStyle = '#00FFFF';
    canvasContent.fillRect(rightRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(answers[answerIndex], answerTextXCoordinate, textYCoordinates[i]);
  }

  //we will have 1 extra coordinate at the end, remove it
  rectangleYCoordinates.pop();
  textYCoordinates.pop();
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

  //reset arrays and variables to their default values
  isAProblemSelected = false;
  rectangleYCoordinates = [10];
  textYCoordinates = [40];
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

function checkIfGameEnd() {
  //game ends when all problems were paired with an answer
  for (i = 0; i < doneAnswers.length; i++) {
    if (!doneAnswers[i]) {
      return;
    }
  }

  //validating the answers given
  for (i = 0; i < linesDrawn.length; i++) {
    if (linesDrawn[i][2]) {
      //green if correct
      canvasContent.fillStyle = '#00FF00';
    } else {
      //red if incorrect
      canvasContent.fillStyle = '#FF0000';
    }
    //clear the old content
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

    //draw the new colored rectangles
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

    //add the text to them
    canvasContent.fillStyle = '#000000';
    canvasContent.fillText(problems[linesDrawn[i][0]], problemTextXCoordinate, textYCoordinates[linesDrawn[i][0]]);
    canvasContent.fillText(orderedAnswers[linesDrawn[i][1]], answerTextXCoordinate, textYCoordinates[linesDrawn[i][1]]);
  }
}

//checks when the user clicks on the canvas
//if they clicked a problem/answer, it will get selected
canvas.addEventListener('click', (event) => {
  //only draw if game has started
  if (submitButton.textContent == 'Restart') {
    let canvasBounds = canvas.getBoundingClientRect();
    let mouseX = event.clientX - canvasBounds.left;
    let mouseY = event.clientY - canvasBounds.top;
    for (i = 0; i < rectangleYCoordinates.length; i++) {
      //first the user needs to click on a problem, then an answer
      if (
        !isAProblemSelected &&
        !doneProblems[i] &&
        isPointInsideRectangle(mouseX, mouseY, leftRectangleXCoordinate, rectangleYCoordinates[i])
      ) {
        //draw the border for the selected problem
        canvasContent.strokeStyle = '#000000';
        canvasContent.strokeRect(leftRectangleXCoordinate, rectangleYCoordinates[i], rectangleWidth, rectangleHeight);
        isAProblemSelected = true;
        doneProblems[i] = true;
        lastClickedProblemIndex = i;
        break;
      } else if (
        isAProblemSelected &&
        !doneAnswers[i] &&
        isPointInsideRectangle(mouseX, mouseY, rightRectangleXCoordinate, rectangleYCoordinates[i])
      ) {
        isAProblemSelected = false;
        doneAnswers[i] = true;
        lastClickedAnswerIndex = i;

        //redrawing the problem rectangle without a border
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
        let isCorrect = eval(problems[lastClickedProblemIndex]).toFixed(2) == orderedAnswers[lastClickedAnswerIndex];
        linesDrawn.push([lastClickedProblemIndex, lastClickedAnswerIndex, isCorrect]);
        break;
      }
    }
    checkIfGameEnd();
  }
});
