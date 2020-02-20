// Javascript for PROJECT: CALCULATOR
const btns = document.querySelectorAll('button');
const backspaceBtn = document.querySelector('#backspace');
const equalBtn = document.querySelector('#equal');
const equationLog = document.querySelector('#equation-log');
const output = document.querySelector('#output');
const pointBtn = document.querySelector('#point');
const operators = ['*', '/', '-', '+'];
let equation = [];
let i = 0;
let result = 0;

function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return a / b;
}
function clearOutput() {
  output.textContent = '';
  pointBtn.disabled = false;
}
function btnsAction(btn) {
  if (!isNaN(parseInt(btn.textContent))) {
    output.textContent += btn.textContent;
  } else if (btn.textContent === '.') {
    output.textContent += btn.textContent;
    pointBtn.disabled = true;
  } else if (btn.textContent === 'AC') {
    clearOutput();
    equationLog.textContent = '';
    equation = [];
    result = 0;
  } else if (btn.textContent === '<--') {
    backspaceBtnAction();
  } else if (btn.textContent === '=') {
    equalBtnAction();
  } else if (operators.includes(btn.textContent)) {
    operatorsBtnsAction(btn);
  }
}
function equalBtnAction() {
  if (equationLog.textContent.includes('=')) {
    equationLog.textContent = equationLog.textContent.slice(equationLog.textContent.search('=') + 1);
  } 
  equationLog.textContent += output.textContent + '=';
  equation[equation.length] = Number(output.textContent);
  operate();
  output.textContent = Math.round((result + Number.EPSILON) * 10000) / 10000; //Rounds number to 4 decimal places
}
function backspaceBtnAction() {
  output.textContent = output.textContent.slice(-output.textContent.length, -1);
  if (output.textContent.slice(-1) === '.') {
    pointBtn.disabled = false;
  }
}
function operatorsBtnsAction(btn) {
  if (equationLog.textContent.includes('=')) {
    equationLog.textContent = equationLog.textContent.slice(equationLog.textContent.search('=') + 1);
    equation[equation.length] = Number(output.textContent);
    equation[equation.length] = btn.textContent;
    equationLog.textContent += output.textContent;
    equationLog.textContent += btn.textContent;
    clearOutput();
  } else if (output.textContent === '') {
    equation[equation.length - 1] = btn.textContent;
    equationLog.textContent = equationLog.textContent.slice(-output.textContent.length, -1) + btn.textContent;
  }else {
    equation[equation.length] = Number(output.textContent);
    equation[equation.length] = btn.textContent;
    equationLog.textContent += output.textContent;
    equationLog.textContent += btn.textContent;
    clearOutput();
  }
}
function operate() {
  //Loops through an array of operators in priority order, 
  //if the equation array includes one, then it makes the operation of the adjacent numbers in the array,
  //until there are no more operators of that kind.
  operators.forEach((op) => {
    while (equation.includes(op)) {
      i = equation.indexOf(op);
      if (op === '*') {
        result = multiply(equation[i - 1], equation[i + 1]);
      } else if (op === '/') {
        result = divide(equation[i - 1], equation[i + 1]);
      } else if (op === '-') {
        result = subtract(equation[i - 1], equation[i + 1]);
      } else if (op === '+') {
        result = add(equation[i - 1], equation[i + 1]);
      }
      equation.splice(i - 1, 3, result);
    }
  })
}

btns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    btnsAction(btn);
  })
})
document.addEventListener('keydown', (e) => {
  btns.forEach((btn) => {
    if (btn.textContent === e.key) {
      btn.classList.toggle('pressed');
      btnsAction(btn);
    }
  })
  //Ifs to account for buttons with textContent that isn't the same as .key
  if (e.key === 'Backspace') {
    backspaceBtn.classList.toggle('pressed')
    backspaceBtnAction();
  } else if (e.key === 'Enter') {
    equalBtn.classList.toggle('pressed');
    equalBtnAction();
  }
})
document.addEventListener('keyup', (e) => {
  btns.forEach((btn) => {
    if (btn.textContent === e.key) {
      btn.classList.toggle('pressed');
    }
  })
  if (e.key === 'Backspace') {
    backspaceBtn.classList.toggle('pressed');
  } else if (e.key === 'Enter') {
    equalBtn.classList.toggle('pressed');
  }
})