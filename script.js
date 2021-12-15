let values = ['0'];
let buttons = document.querySelectorAll('button');
for (let button of buttons) {
    const buttonValue = button.dataset.value;
    const numbers = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const operators = ['+', '-', '*', '/'];
    if (numbers.includes(buttonValue)) {
        button.addEventListener('click', function() {
            handleNumber(buttonValue);
        });
    }
    else if (buttonValue === '.') {
        button.addEventListener('click', handleDecimal);
    }
    else if (operators.includes(buttonValue)) {
        button.addEventListener('click', function() {
            handleOperator(buttonValue);
        })
    }
    else if (buttonValue === '=') {
        button.addEventListener('click', handleEquals);
    } 
}
function add(x, y) {
    return x + y;
}
function subtract(x, y) {
    return x-y;
}
function multiply(x, y) {
    return x * y;
}
function divide(x, y) {
    return x / y;
}
function operate(x, y, operator) {
    switch (operator) {
        case '+':
            return add(x, y);
            break;
        case '-':
            return subtract(x, y);
            break;
        case '*':
            return multiply(x, y);
            break;
        case '/':
            return divide(x, y);
            break;
    }
}
function calculate() {
    console.log(values);
    const lastValue = values[values.length - 1];
    const secondLastValue = values[values.length - 2];
    const thirdLastValue = values[values.length - 3];
    const fourthLastValue = values[values.length -4];
    const operators = ['-', '+', '*', '/'];
    // if the last value is an operator which is preceded by number, operator, number (three items in a row), display the result
    if (operators.includes(lastValue) && (typeof secondLastValue !== 'undefined') && (typeof thirdLastValue !== 'undefined') && (typeof fourthLastValue !== 'undefined')) {
        const result = operate(Number(fourthLastValue), Number(secondLastValue), thirdLastValue);
        resultStr = result.toString();
        values = [resultStr, lastValue];  
    }
}

function populateDisplay() {
    const displayDiv = document.querySelector('div.display');
    const operators = ['-', '+', '*', '/'];
    let displayValue;
    if(operators.includes(values[values.length - 1])) {  // if the last item in the values arr is an operator...
        displayValue = formatToMax10Chars(values[values.length - 2]); // don't display the operator, only display a number
    }
    else displayValue = formatToMax10Chars(values[values.length -1]); 
    displayDiv.textContent = displayValue;
    
    function formatToMax10Chars(str) {
        if (str.length > 10 && ((Number(str) > 1e9))) {
            // if the number is huge, display it in scientific notation
            str = Number(str).toExponential();
        }
        else if (str.length > 10) {
            // else, if the string is too long b/c the number has too many decimal
            // places, reduce the string to 10 chars max
            str = str.slice(0, 10);
            // but if that means that the last char would be a decimal point, 
            // cut off that decimal point as well
            if (str[9] === '.') str = str.slice(0,9);
        }
        return str;
    }
}

function handleNumber(x) {
    // if the last item in the values arr ends with a number followed by a decimal point, concatenate onto that item
    const lastItemInValues = values[values.length - 1];
    const floatRegex = /[0-9\.]$/;
    if (floatRegex.test(lastItemInValues)) {
        // if the last item is too long, just return.  arbitrarly chose 10.
        // adjust to size of font in display as needed
        if(lastItemInValues.length === 10) return;

        // if there is only one char in the str which is a 0, replace that number
        else if(lastItemInValues === '0') {
            values[values.length - 1] = x;
        }

        else values[values.length - 1] += x;
    }

    // if the last item in the values arr is a /, *, -, or +, push the number as a new str
    const operatorRegex = /[+\-*\/]$/;
    if (operatorRegex.test(lastItemInValues)) {
        values.push(x);
    }
    while (values.length > 4) values.shift();
    calculate();
    populateDisplay();
}
function handleOperator(operator) {
    // if the last item in the values is a "number str", push the operator as a new str
    const lastItemInValues = values[values.length - 1];
    const numbersRegex = /[0-9\.]$/;
    if (numbersRegex.test(lastItemInValues)) {
        values.push(operator);
    }
    // if the last item.... is a / * - + replace that item
    const operatorAndDecimalRegex = /[+\-*\/]$/;
    if (operatorAndDecimalRegex.test(lastItemInValues)) {
        values[values.length - 1] = operator;
    }
    while (values.length > 4) values.shift();
    calculate();
    populateDisplay();
}
function handleDecimal() {
    // if the last item in the values arr is a "number str", add the decimal to the str
    const lastItemInValues = values[values.length - 1];
    const numbersRegex = /[0-9]$/;
    if (numbersRegex.test(lastItemInValues)) {
        values[values.length - 1] += '.';
    }
    // if the last item in the values arr is a /, *, -, or +, push a new str to the arr that starts with '0.'
    const operatorRegex = /[+\-*\/]$/;
    if (operatorRegex.test(lastItemInValues)) {
        values.push('0.');
    }
    // if the last item in the values arr is a decimal point, return
    const decimalRegex = /\.$/;
    if (decimalRegex.test(lastItemInValues)) return;
    while (values.length > 4) values.shift();
    calculate();
    populateDisplay();
}
function handleEquals() {
    const lastItemInValues = values[values.length - 1];

    // if the last item in the values arr is an integer, calculate and display
    const integerRegex = /[0-9]+/;
    if (integerRegex.test(lastItemInValues)) {
        calculate();
        populateDisplay();
    }

    // if the last item in the values arr is an integer followed by a point, calculate and display
    const integerThenPointRegex = /[0-9]+\.]$/;
    if (integerThenPointRegex.test(lastItemInValues)) {
        calculate();
        populateDisplay();
    }

    // if the last item in teh values arr is just a decimal point, add a zero before the point, then calculate and display
    if (lastItemInValues === '.') {
        values[values.length - 1] = '0.';
        calculate();
        display();
    }
    // if the last item in the values arr is a float, calculate and display
    const floatRegex = /[0-9]*\.[0-9]+$/;
    if (floatRegex.test(lastItemInValues)) {
        console.log('fire');
        calculate();
        populateDisplay();
    }

    // if the last item in the values arr is an operator, just get rid of that last operator
    const operatorRegex = /[+\-*\/]$/;
    if (operatorRegex.test(lastItemInValues)) {
        values.pop();
        calculate();
        display();
    }
}



    


