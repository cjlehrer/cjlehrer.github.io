const buttons = document.querySelectorAll('.button');
const calc = {
    displayValue: '',
    newNum: false,
    operators: new Array(),
    number1: undefined,
    number2: undefined,
    repeatOpeator: false
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
    
    /*
    if (calc.displayValue.toString().search('e+') > 0 && calc.displayValue.toString().length > 18) {
        view.style.fontSize = (fontSize * .9) + 'vh';
    } else if(calc.displayValue.toString().length > 18 ) {
        fontSize = fontSize * .964;
        view.style.fontSize = fontSize + 'vh';
    } 
    if(calc.displayValue.toString().length > 18 ) {
        
        let newFontSize = fontSize * ((18/calc.displayValue.length));
        //                             max characters / currentCharacters
        view.style.fontSize = newFontSize + 'vh';   
    }*/

    display(calc.displayValue);

    /*
    if(view.scrollWidth> view.offsetWidth) {  //this is gross
        
        let multiplier = (calc.displayValue.length)/(calc.displayValue.length + 1);
        fontSize = fontSize * multiplier;
        view.style.fontSize = fontSize + 'vh';  
    }*/
}
/*
function getTextWidth(text) { 
  
    inputText = text; 
    font = fontSize +" Times"; 

    canvas = document.createElement("canvas"); 
    context = canvas.getContext("2d"); 
    context.font = font; 
    width = context.measureText(inputText).width; 
    formattedWidth = Math.ceil(width) + "px"; 

    document.querySelector('.output').textContent 
                = formattedWidth; 
} */



function clearNumbers() {
    fontReset();
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

function clearDisplay () { //when CE is pressed
    calc.displayValue = '';
    display(0);
}



function operate(operator) {
    y = Number(calc.number2);
    x = Number(calc.number1);
    let output;

    switch (operator) {
        case 'add':
            let sum = add(x,y);
            return sum;
            break;
        case 'subtract':
            let result = subtract(x,y);
            return result;
            break;
        case 'multiply':
            let product = multiply(x,y);
            return product;      
            break;
        case 'divide':
            let quotient = divide(x,y);
            return quotient;
            break;
    }

}




function equals() {
    let operator;
    operator = calc.operators.shift();
    let result;
    calc.displayValue = operate(operator);
    calc.newNum = true;
    writeNumbers(calc.displayValue);
    calc.number1 = undefined;
    calc.number2 = undefined;
    calc.repeatOpeator = false;
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
    let str =calc.displayValue
    str = str.slice(0, -1);
    calc.newNum = true;

    writeNumbers(str);
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
    if(button != 'equals') {
        calc.operators.push(button);
    }
    calc.newNum = true;
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
            writeNumbers(button);
            calc.repeatOpeator = false;
            break;
        case '.':
            doDecimal(button);
            calc.repeatOpeator = false;
            break;
        case 'plusMinus':
            calc.displayValue = Number(calc.displayValue * -1);
            display(calc.displayValue);
            break;
        case 'backspace':
            backspace();
            break;
        case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':           
        case 'equals':
            catchNumber(button);
            if(equalCheck() == 'yes') {
                equals();
            }            
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
        case 'equals':  
            catchNumber(button); 

            if(equalCheck() == 'yes') {
                equals();
            }

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

