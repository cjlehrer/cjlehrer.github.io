const buttons = document.querySelectorAll('.button');
const calc = {
    displayValue: '',
    newNum: false,
    operators: new Array(),
    number1: undefined,
    number2: undefined,
    repeatOpeator: false,
    back: false,
    clearEverything: false
}



const view = document.getElementById('view');
let fontSize = 7;
view.style.fontSize = fontSize + 'vh';
let fontResetSize = 7;


function add(x,y) { 
    return x + y;
}

function subtract(x,y) {
    return x - y;
}

function multiply(x,y) {
    return x * y;
}

function divide(x,y) {
    return x / y;
}

function fontReset(){
    view.style.fontSize = fontResetSize + 'vh';
    fontSize = fontResetSize;
}

function writeNumbers (num) {
    if(calc.newNum == true) {
        clearNumbers();
        fontReset();
    } 
    
    if (calc.displayValue.length <= 18) {
        calc.displayValue = calc.displayValue.concat(num);  
    }


    display(calc.displayValue);

    while(view.scrollWidth> view.offsetWidth) {  
        fontSize = fontSize * .98;
        view.style.fontSize = fontSize + 'vh';  
    }
}




function clearNumbers() {
    clearDisplay();
    calc.displayValue = '';
    calc.newNum = false;
}

function display(dispV) {
    document.getElementById('view').innerHTML = dispV;
}

function clearAll() { // when C is pressed
    calc.displayValue = '';
    calc.newNum = false;
    calc.operators = [];
    calc.number1 = undefined;
    calc.number2 = undefined;
    fontReset();
    clearDisplay();
}

function clearDisplay () { 
    calc.displayValue = '';
    display(0);
}



function operate(operator) {
    y = Number(calc.number2);
    x = Number(calc.number1);
    let output;

    switch (operator) {
        case '+':
            let sum = add(x,y);
            return sum;
            break;
        case '-':
            let result = subtract(x,y);
            return result;
            break;
        case '*':
            let product = multiply(x,y);
            return product;      
            break;
        case '/':
            let quotient = divide(x,y);
            return quotient;
            break;
    }

}




function equals() {
    let operator;
    operator = calc.operators.shift();

    calc.displayValue = operate(operator);
    calc.newNum = true;
    writeNumbers(calc.displayValue);
    calc.number1 = undefined;
    calc.number2 = undefined;
    calc.repeatOpeator = false;
    calc.back = false;
}

function equalCheck() {

    if(calc.number1 !== undefined && calc.number2 !== undefined && calc.operators[0] !== undefined) {
        return 'yes';
    } else {
        return 'no';
    }
}

function doDecimal(button) {
    let decimalCheck = calc.displayValue.includes('.');
    if (decimalCheck == false) {
        writeNumbers(button);
    }
}

function backspace() {
    if(calc.back == true){
        let str =calc.displayValue
        if(str.length == 1) {
            calc.displayValue == '';
            clearDisplay();
        } else {
            str = str.slice(0, -1);
            calc.newNum = true;
            writeNumbers(str);
        }

    }

}

function catchNumber(button) {
    if(calc.repeatOpeator == false) {
        if(calc.number1 == undefined) {
            calc.number1 = calc.displayValue;
        } else {
            calc.number2 = calc.displayValue;
        }
        calc.repeatOpeator = true;

    } else {
        calc.operators.pop();
    }
    if(button != 'Enter') {
        calc.operators.push(button);
    }
    calc.newNum = true;
}

function clearEverythingCheck() {
    if(calc.clearEverything == true) {
        clearAll();
        calc.clearEverything == false;
    }
}
function buttonCheck(button) {
    calc.displayValue = calc.displayValue.toString();
    switch (button) {
        case 'C':
            clearAll();
            clearDisplay();
            break;
        case 'CE':
            calc.displayValue = '';
            clearDisplay();
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            calc.back = true;
            clearEverythingCheck();
            writeNumbers(button);
            calc.repeatOpeator = false;

            break;
        case '.':
            calc.back = true;
            clearEverythingCheck();
            doDecimal(button);
            calc.repeatOpeator = false;

            break;
        case 'plusMinus':
            calc.displayValue = Number(calc.displayValue * -1);
            display(calc.displayValue);
            break;
        case 'Backspace':
            backspace();
            break;
        case '+':
        case '-':
        case '*':
        case '/':      
            calc.clearEverything = false;     
        case 'Enter':
            catchNumber(button);
            if(equalCheck() == 'yes') {
                equals();
            }            
            if(button == 'Enter') {
                calc.clearEverything = true; 
            }

        case '+':
        case '-':
        case '*':
        case '/':
            catchNumber(button); 
            if(equalCheck() == 'yes') {
                equals();
            }
            break;           
        default:

    }
/*
    if(calc.displayValue == '') {
        display(0);
        calc.number1 == '';
        calc.number2 == '';
        calc.operator1 == '';
        calc.operator2 == '';
    }
*/

}   


buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
        let buttonPress = button.getAttribute('data-key');
        buttonCheck(buttonPress);
        
    });
});

document.addEventListener('keydown', (e) => {
    buttonCheck(e.key);
 });